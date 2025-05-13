from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Omogoči CORS (za povezavo s frontendom na localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "TraceBit API deluje"}

@app.post("/fingerprint")
async def receive_fingerprint(request: Request):
    data = await request.json()
    print("Prejet fingerprint:", data)
    return {"status": "prejeto"}


@app.get("/")
def read_root():
    return {"message": "TraceBit API is working"}

@app.post("/fingerprinttest")
async def receive_fingerprint(request: Request):
    # Get the data sent from the frontend
    data = await request.json()
    print("prejeti podatki fingerprinta:", data)
    
    # Here you can add logic to store or process the data
    response={
        "status":"received",
        "data":data,
        "message":"Fingerprint podatki uspešno prejeti"
    }


    return response
