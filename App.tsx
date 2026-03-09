<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RE-LIFE Aljabirya | المنصة المتكاملة</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Tajawal', sans-serif; background-color: #f8fafc; scroll-behavior: smooth; }
        .card-bento { background: white; border-radius: 1.5rem; border: 1px solid #e2e8f0; transition: 0.3s; }
        .card-bento:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.05); }
        .symbol-card { border-top: 4px solid #10b981; }
    </style>
</head>
<body>

    <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
            <div class="bg-emerald-600 p-2 rounded-xl text-white"><i data-lucide="recycle"></i></div>
            <span class="text-xl font-black text-emerald-900">RE-LIFE Aljabirya</span>
        </div>
        <div class="hidden md:flex gap-6 font-bold text-sm">
            <a href="#gallery" class="hover:text-emerald-600">معرض المواد</a>
            <a href="#guide" class="hover:text-emerald-600">الدليل التعليمي</a>
            <a href="#calculator" class="hover:text-emerald-600">الحاسبة</a>
        </div>
    </nav>

    <section class="pt-32 pb-20 px-6 bg-[#022c22] text-white text-center">
        <h1 class="text-4xl md:text-6xl font-black mb-4">مستقبل التدوير في الجابرية</h1>
        <p class="text-emerald-100/70 max-w-2xl mx-auto">دليلك الشامل لفرز النفايات، رموز البلاستيك، وحساب أثرك البيئي في مملكة البحرين.</p>
    </section>

    <section id="gallery" class="py-20 px-6 max-w-6xl mx-auto">
        <h2 class="text-2xl font-black mb-8 flex items-center gap-2"><i data-lucide="layout-grid" class="text-emerald-600"></i> معرض المواد (Waste Gallery)</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="card-bento p-6 text-center">
                <div class="text-3xl mb-2">📄</div>
                <h3 class="font-bold">ورق وكرتون</h3>
                <span class="recycle-badge text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">قابل للتدوير</span>
            </div>
            <div class="card-bento p-6 text-center">
                <div class="text-3xl mb-2">🍼</div>
                <h3 class="font-bold">بلاستيك PET</h3>
                <span class="recycle-badge text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">قابل للتدوير</span>
            </div>
            <div class="card-bento p-6 text-center border-red-100 bg-red-50">
                <div class="text-3xl mb-2">🍕</div>
                <h3 class="font-bold">ورق ملوث</h3>
                <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">غير قابل</span>
            </div>
            <div class="card-bento p-6 text-center">
                <div class="text-3xl mb-2">🥫</div>
                <h3 class="font-bold">معادن</h3>
                <span class="recycle-badge text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">قابل للتدوير</span>
            </div>
        </div>
    </section>

    <section id="symbols" class="py-16 bg-slate-50 px-6">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-2xl font-black mb-8">رموز التدوير العالمية (1-7)</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="card-bento p-6 symbol-card">
                    <div class="text-2xl font-black text-emerald-600 mb-2">01 PETE</div>
                    <p class="text-sm text-slate-600">زجاجات المياه والمشروبات الغازية. سهل التدوير جداً.</p>
                </div>
                <div class="card-bento p-6 symbol-card">
                    <div class="text-2xl font-black text-emerald-600 mb-2">02 HDPE</div>
                    <p class="text-sm text-slate-600">علب المنظفات والشامبو. بلاستيك عالي الكثافة.</p>
                </div>
                <div class="card-bento p-6 border-red-200">
                    <div class="text-2xl font-black text-red-600 mb-2">03 PVC</div>
                    <p class="text-sm text-slate-600">أنابيب السباكة. يصعب تدويره ويحتوي على مواد سامة.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="calculator" class="py-20 px-6 max-w-6xl mx-auto">
        <div class="bg-emerald-900 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row gap-10 items-center">
            <div class="flex-1">
                <h2 class="text-3xl font-black mb-6">احسب أثرك البيئي</h2>
                <div class="space-y-6">
                    <input type="range" id="plastic" min="0" max="50" class="w-full accent-emerald-400" oninput="update()">
                    <p class="text-sm text-emerald-200">بلاستيك: <span id="pNum">0</span> كجم</p>
                </div>
            </div>
            <div class="bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-full md:w-80 text-center">
                <p class="text-emerald-300 font-bold mb-2">توفير طاقة</p>
                <div class="text-5xl font-black mb-4"><span id="energy">0</span></div>
                <p class="text-xs text-emerald-100/50">كيلوواط ساعة (kWh)</p>
            </div>
        </div>
    </section>

    <div id="chat" class="fixed bottom-6 left-6 z-50 w-80 md:w-96 hidden">
        <div class="bg-white rounded-2xl shadow-2xl border flex flex-col h-[450px]">
            <div class="bg-emerald-700 p-4 text-white flex justify-between">
                <span class="font-bold">مساعد الجابرية الذكي</span>
                <button onclick="document.getElementById('chat').classList.add('hidden')">✕</button>
            </div>
            <div id="messages" class="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-slate-50"></div>
            <div class="p-4 border-t flex gap-2">
                <input type="text" id="msgInput" class="flex-1 border p-2 rounded-lg outline-none" placeholder="اسأل عن مادة...">
                <button onclick="send()" class="bg-emerald-600 text-white px-4 rounded-lg">إرسال</button>
            </div>
        </div>
    </div>

    <button onclick="document.getElementById('chat').classList.remove('hidden')" class="fixed bottom-6 left-6 bg-emerald-600 text-white p-4 rounded-full shadow-xl z-40">
        <i data-lucide="message-circle"></i>
    </button>

    <script>
        lucide.createIcons();

        function update() {
            const p = document.getElementById('plastic').value;
            document.getElementById('pNum').innerText = p;
            document.getElementById('energy').innerText = (p * 5.7).toFixed(1);
        }

        async function send() {
            const input = document.getElementById('msgInput');
            const box = document.getElementById('messages');
            if(!input.value) return;

            box.innerHTML += `<div class="bg-emerald-100 p-3 rounded-lg text-emerald-900 ml-8">${input.value}</div>`;
            const query = input.value;
            input.value = "";

            // ضع مفتاحك هنا ليعمل الذكاء الاصطناعي
            const key = "ضع_مفتاح_API_الخاص_بك_هنا"; 
            try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({contents: [{parts: [{text: query + " (أجب كخبير تدوير في البحرين باختصار)"}]}]})
                });
                const data = await res.json();
                box.innerHTML += `<div class="bg-white border p-3 rounded-lg mr-8 shadow-sm">${data.candidates[0].content.parts[0].text}</div>`;
            } catch {
                box.innerHTML += `<div class="text-red-500 text-xs text-center">تأكد من إعداد مفتاح API بشكل صحيح في الكود.</div>`;
            }
            box.scrollTop = box.scrollHeight;
        }
    </script>
</body>
</html>

