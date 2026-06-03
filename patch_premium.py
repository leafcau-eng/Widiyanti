from pathlib import Path

f = Path("src/App.jsx")
text = f.read_text()

# 1. Tambah premium frame
hero_tag = """      <section id="cover" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", padding: "40px 20px", textAlign: "center",
      }}>"""

premium_frame = hero_tag + """

        {/* Premium Frame */}
        <div
          style={{
            position: "absolute",
            inset: "18px",
            border: "1px solid rgba(212,175,55,0.35)",
            borderRadius: "36px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: "34px",
            border: "1px solid rgba(212,175,55,0.12)",
            borderRadius: "36px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
"""

text = text.replace(hero_tag, premium_frame)

# 2. Floral kiri
text = text.replace(
'''        <div style={{ position: "absolute", top: 0, left: 0, opacity: 0.08 }}>
          {null}
        </div>''',
'''        <div
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
        </div>'''
)

# 3. Floral kanan
text = text.replace(
'''        <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.08, transform: "scaleX(-1)" }}>
          {null}
        </div>''',
'''        <div
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
        </div>'''
)

# 4. Hapus lantern kosong
text = text.replace(
'''        <div style={{ position: "absolute", top: "5%", left: "4%", animation: "lanternSwing 4s ease-in-out infinite" }}>
          {null}
        </div>
        <div style={{ position: "absolute", top: "5%", right: "4%", animation: "lanternSwing 3.5s ease-in-out infinite reverse" }}>
          {null}
        </div>''',
''
)

# 5. Besarkan The Wedding Of
text = text.replace(
'letterSpacing: "6px", fontSize: "11px"',
'letterSpacing: "8px", fontSize: "13px"'
)

f.write_text(text)
print("✅ Premium Hero Patch Applied")
