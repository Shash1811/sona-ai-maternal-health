import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Configuration Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_DIRECTORY = os.path.join(BASE_DIR, "pdfs")
CHROMA_DB_DIR = os.path.join(os.path.dirname(BASE_DIR), "sona-ai-backend", "chroma_db")

def build_vector_database():
    print("🚀 Starting RAG Data Ingestion Pipeline...")

    # 1. LOAD: Read all PDFs from the directory
    print(f"📂 Loading PDFs from {PDF_DIRECTORY}...")
    loader = PyPDFDirectoryLoader(PDF_DIRECTORY)
    raw_documents = loader.load()
    
    if not raw_documents:
        print("❌ No PDFs found! Make sure they are in the correct folder.")
        return

    print(f"✅ Loaded {len(raw_documents)} pages.")

    # 2. CHUNK: Split the massive text into smaller, digestible pieces
    # chunk_size=1000 means ~250 words per chunk. 
    # chunk_overlap=200 ensures we don't cut a sentence in half and lose context.
    print("✂️  Chunking documents...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(raw_documents)
    print(f"✅ Split into {len(chunks)} text chunks.")

    # 3. EMBED: Convert text chunks into numerical vectors
    # Using a fast, free, local embedding model from HuggingFace
    print("🧠 Initializing Embedding Model (this may take a moment to download the first time)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 4. STORE: Save the vectors into ChromaDB
    print(f"💾 Saving vectors to local ChromaDB at {CHROMA_DB_DIR}...")
    
    # We clear out the old database if it exists so we don't duplicate data
    if os.path.exists(CHROMA_DB_DIR):
        print("🧹 Clearing old database...")
        
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DB_DIR
    )
    
    print("🎉 Ingestion Complete! Your RAG vector database is ready.")

if __name__ == "__main__":
    # Ensure the directory exists before trying to load from it
    os.makedirs(PDF_DIRECTORY, exist_ok=True)
    build_vector_database()