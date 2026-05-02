"""
Thin FastAPI wrapper around shaclex-py.
Exposes:
  POST /translate/shacl2shex   body: plain-text Turtle  → returns ShExC text
  POST /translate/shex2shacl   body: plain-text ShExC   → returns Turtle text
  POST /translate/shacl2shexje body: plain-text Turtle  → returns ShexJE JSON
  GET  /health                 → {"ok": true}
"""

import subprocess, tempfile, os
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ShapeTranslator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DIRECTIONS = {
    "shacl2shex":   (".ttl",  ".shex"),
    "shex2shacl":   (".shex", ".ttl"),
    "shacl2shexje": (".ttl",  ".json"),
    "shex2shexje":  (".shex", ".json"),
    "shexje2shacl": (".json", ".ttl"),
    "shexje2shex":  (".json", ".shex"),
}

MEDIA_TYPES = {
    ".ttl":  "text/turtle",
    ".shex": "text/plain",
    ".json": "application/json",
}


def run_translation(direction: str, body: bytes) -> str:
    if direction not in DIRECTIONS:
        raise HTTPException(400, f"Unknown direction: {direction}")
    in_ext, out_ext = DIRECTIONS[direction]
    with tempfile.NamedTemporaryFile(suffix=in_ext, delete=False) as fin:
        fin.write(body)
        fin_path = fin.name
    fout_path = fin_path.replace(in_ext, f"_out{out_ext}")
    try:
        result = subprocess.run(
            ["shaclex-py", "--input", fin_path, "--output", fout_path, "--direction", direction],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode != 0:
            raise HTTPException(422, f"Translation failed:\n{result.stderr.strip()}")
        with open(fout_path, "r", encoding="utf-8") as f:
            return f.read()
    finally:
        for p in (fin_path, fout_path):
            try: os.unlink(p)
            except FileNotFoundError: pass


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/translate/{direction}")
async def translate(direction: str, request: Request):
    body = await request.body()
    if not body:
        raise HTTPException(400, "Empty body")
    output = run_translation(direction, body)
    _, out_ext = DIRECTIONS.get(direction, ("", ".txt"))
    return Response(content=output, media_type=MEDIA_TYPES.get(out_ext, "text/plain"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8765, log_level="info")
