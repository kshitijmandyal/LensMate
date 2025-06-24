import os
from fastapi import FastAPI, UploadFile, HTTPException, File
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import google.generativeai as genai

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY environment variable not set.")

genai.configure(api_key=GOOGLE_API_KEY)

class AspectRating(BaseModel):
    aspect: str
    rating: int
    comment: str

class AnalysisResponse(BaseModel):
    photograph_type: str
    technical_aspects: List[AspectRating]
    artistic_merits: List[AspectRating]
    improvement_suggestions: List[str]
    overall_assessment: str
    skill_level: str

app = FastAPI()

@app.get("/")
async def health_check():
    return {"status": "OK", "message": "LensMate API is running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://lensmate.vercel.app",
    ],
    allow_origin_regex=r"https://lensmate-[a-z0-9\-]+\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def parse_aspects(section_text: str) -> List[dict]:
    aspects = []
    current_aspect = None
    for line in section_text.split("\n"):
        line = line.strip()
        if line.startswith("**") and line.endswith(":**"):
            current_aspect = line[2:-2]
        elif current_aspect and line.endswith("/10"):
            rating = int(line.split("/")[0])
            aspects.append({
                "aspect": current_aspect,
                "rating": rating,
                "comment": ""
            })
            current_aspect = None
        elif aspects and line:
            aspects[-1]["comment"] = (aspects[-1]["comment"] + " " + line).strip() if aspects[-1]["comment"] else line
    return aspects

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)
):
    try:
        contents = await file.read()
        mime_type = file.content_type or "image/jpeg"

        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = (
    "Analyze this photograph as if you were a seasoned professional photographer and art critic.\n"
    "Return your response in the following EXACT format:\n\n"
    
    "### Photograph Type\n"
    "[portrait/landscape/street/abstract/etc.]\n\n"
    
    "### Technical Aspects\n\n"
    "**Composition:**\n"
    "X/10\n"
    "[1-3 sentence evaluation based on rule of thirds, framing and balance]\n\n"
    
    "**Lighting:**\n"
    "X/10\n"
    "[1-3 sentence evaluation of exposure, shadow detail and highlight control]\n\n"
    
    "**Focus:**\n"
    "X/10\n"
    "[1-3 sentence assessment of sharpness and depth of field effectiveness]\n\n"
    
    "**Color Treatment:**\n"
    "X/10\n"
    "[1-3 sentence evaluation of color accuracy and mood enhancement]\n\n"
    
    "### Artistic Merits\n\n"
    "**Creativity:**\n"
    "X/10\n"
    "[1-3 sentence assessment of originality and storytelling]\n\n"
    
    "**Emotional Impact:**\n"
    "X/10\n"
    "[1-3 sentence evaluation of mood conveyance]\n\n"
    
    "**Subject Handling:**\n"
    "X/10\n"
    "[1-3 sentence assessment of subject positioning and relevance]\n\n"
    
    "### Improvement Suggestions\n\n"
    "1. [Specific composition adjustment - keep under 15 words]\n"
    "2. [Specific lighting adjustment - keep under 15 words]\n"
    "3. [Specific perspective adjustment - keep under 15 words]\n\n"
    
    "### Overall Assessment\n"
    "[One concise sentence summary of the photograph's quality]\n\n"
    
    "Skill Level: [Beginner/Intermediate/Advanced]\n\n"
    
    "STRICT FORMATTING RULES:\n"
    "- Do not use markdown headings beyond what's specified\n"
    "- Never truncate responses - always complete sentences\n"
    "- Maintain exactly this structure and line breaks\n"
    "- Keep all ratings as integers between 0-10\n"
    "- Never omit any section"
)
        response = model.generate_content([
            prompt,
            {
                "mime_type": mime_type,
                "data": contents
            }
        ])

        raw = response.text.strip()
        sections = {}
        current_section = None
        for line in raw.splitlines():
            if line.startswith("### "):
                current_section = line[4:].strip()
                sections[current_section] = []
            elif current_section:
                sections[current_section].append(line)

        # Helper to join and clean section text
        def get_section(name):
            return "\n".join(sections.get(name, [])).strip()

        photograph_type = get_section("Photograph Type").replace("[Type: ", "").replace("]", "").strip()
        if not photograph_type:
            pt_lines = [l for l in get_section("Photograph Type").splitlines() if l.strip()]
            if pt_lines:
                photograph_type = pt_lines[0].replace("[Type: ", "").replace("]", "").strip()

        technical_aspects = parse_aspects(get_section("Technical Aspects"))
        artistic_merits = parse_aspects(get_section("Artistic Merits"))
        improvement_suggestions = [
            line.lstrip("-1234567890. ").strip()
            for line in get_section("Improvement Suggestions").splitlines()
            if line.strip()
        ]

        overall_assessment_section = get_section("Overall Assessment")
        skill_level = ""
        overall_assessment = overall_assessment_section

        if "Skill Level:" in overall_assessment_section:
            parts = overall_assessment_section.split("Skill Level:")
            overall_assessment = parts[0].strip()
            skill_level = parts[1].strip()
        else:
            for line in raw.splitlines():
                if line.strip().startswith("Skill Level:"):
                    skill_level = line.split("Skill Level:")[1].strip()

        feedback_sections = AnalysisResponse(
            photograph_type=photograph_type,
            technical_aspects=technical_aspects,
            artistic_merits=artistic_merits,
            improvement_suggestions=improvement_suggestions,
            overall_assessment=overall_assessment,
            skill_level=skill_level
        )

        return feedback_sections

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))