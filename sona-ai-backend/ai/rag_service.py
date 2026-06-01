import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List


@dataclass
class RetrievedChunk:
    source: str
    title: str
    text: str
    score: float


class RAGService:
    """Small local document retriever for WHI/WHO maternal health documents."""

    def __init__(self, docs_dir: str | None = None):
        base_dir = Path(__file__).resolve().parents[1]
        self.docs_dir = Path(docs_dir or os.getenv("WHI_DOCUMENTS_DIR", base_dir / "knowledge" / "whi_documents"))
        self._chunks: List[RetrievedChunk] = []
        self._loaded = False

    def retrieve(self, query: str, limit: int = 4) -> List[Dict[str, str]]:
        self._ensure_loaded()
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        scored = []
        for chunk in self._chunks:
            chunk_tokens = self._tokenize(chunk.text)
            overlap = query_tokens.intersection(chunk_tokens)
            if not overlap:
                continue
            score = len(overlap) / max(len(query_tokens), 1)
            scored.append(
                RetrievedChunk(
                    source=chunk.source,
                    title=chunk.title,
                    text=chunk.text,
                    score=score,
                )
            )

        scored.sort(key=lambda item: item.score, reverse=True)
        return [
            {
                "source": item.source,
                "title": item.title,
                "text": item.text,
                "score": round(item.score, 3),
            }
            for item in scored[:limit]
        ]

    def build_context(self, chunks: List[Dict[str, str]]) -> str:
        if not chunks:
            return ""

        context_blocks = []
        for index, chunk in enumerate(chunks, start=1):
            context_blocks.append(
                f"[{index}] {chunk['title']} ({chunk['source']}):\n{chunk['text']}"
            )
        return "\n\n".join(context_blocks)

    def _ensure_loaded(self):
        if self._loaded:
            return

        self.docs_dir.mkdir(parents=True, exist_ok=True)
        documents = []
        for pattern in ("*.txt", "*.md"):
            documents.extend(self.docs_dir.glob(pattern))

        for path in sorted(documents):
            text = path.read_text(encoding="utf-8", errors="ignore")
            title = self._extract_title(text, path)
            for chunk in self._chunk_text(text):
                self._chunks.append(
                    RetrievedChunk(
                        source=path.name,
                        title=title,
                        text=chunk,
                        score=0,
                    )
                )

        self._loaded = True

    def _chunk_text(self, text: str, max_words: int = 150) -> List[str]:
        clean = re.sub(r"\s+", " ", text).strip()
        words = clean.split()
        chunks = []
        for index in range(0, len(words), max_words):
            chunk = " ".join(words[index : index + max_words]).strip()
            if len(chunk) > 80:
                chunks.append(chunk)
        return chunks

    def _extract_title(self, text: str, path: Path) -> str:
        for line in text.splitlines():
            clean = line.strip().lstrip("#").strip()
            if clean:
                return clean[:90]
        return path.stem.replace("_", " ").title()

    def _tokenize(self, text: str) -> set[str]:
        stopwords = {
            "the",
            "and",
            "for",
            "with",
            "that",
            "this",
            "you",
            "your",
            "are",
            "can",
            "what",
            "when",
            "how",
            "why",
            "from",
            "have",
            "has",
            "into",
            "about",
            "during",
        }
        return {
            token
            for token in re.findall(r"[a-zA-Z][a-zA-Z\-]{2,}", text.lower())
            if token not in stopwords
        }
