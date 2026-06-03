from pathlib import Path

f = Path("src/App.jsx")
text = f.read_text()

# Hapus emoji bunga
text = text.replace("""
        <div
          style={{
            position: "absolute",
            top: "25px",
            left: "25px",
            fontSize: "90px",
            opacity: 0.08,
            zIndex: 0,
          }}
        >
          ✿
        </div>
""", "")

text = text.replace("""
        <div
          style={{
            position: "absolute",
            top: "25px",
            right: "25px",
            fontSize: "90px",
            opacity: 0.08,
            zIndex: 0,
            transform: "scaleX(-1)",
          }}
        >
          ✿
        </div>
""", "")

# Tambahkan geometric gold frame setelah Premium Frame
target = """        {/* Premium Frame */}"""

insert = """        {/* Premium Frame */}

        <svg
          viewBox="0 0 1000 300"
          style={{
            position: "absolute",
            top: "20px",
            left: 0,
            width: "100%",
            height: "180px",
            opacity: 0.35,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <path
            d="M120 180 L300 40 L500 120 L700 50 L880 180"
            fill="none"
            stroke="rgba(212,175,55,0.8)"
            strokeWidth="2"
          />
          <path
            d="M120 100 L320 180 L500 60 L680 180 L880 100"
            fill="none"
            stroke="rgba(212,175,55,0.5)"
            strokeWidth="2"
          />
        </svg>
"""

text = text.replace(target, insert, 1)

f.write_text(text)
print("✅ Geometric Luxury Patch Applied")
