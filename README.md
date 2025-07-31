# 💬 ChatViz – WhatsApp Group Chat Data Visualisation

[Live Demo](https://chatviz.vercel.app/visualisation)

ChatViz is a data visualisation tool built with Next.js that helps users explore insights and patterns from their **WhatsApp group chat exports**. Originally inspired by a small fitness group chat that wanted to track ✅ check-ins, the project has grown into a fully interactive, privacy-friendly analytics dashboard.

---

## 🔍 Key Features

- 📈 **Data Visualisation** using Chart.js and Tremor UI
- 🧠 **Regex-based parsing** of WhatsApp `.txt` exports (any date & time format supported)
- 💾 **Local storage** only – no data ever leaves the browser
- 🔎 **Search & Filter** messages by author, date, or keyword
- 🗂️ Group message trends, author activity breakdowns, emoji frequency, and more

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Language:** TypeScript
- **Styling:** [TailwindCSS](https://tailwindcss.com)
- **Charts:** [Chart.js](https://www.chartjs.org)
- **UI Components:** [Tremor](https://www.tremor.so)

---

## 🧾 How It Works

1. **Export Your WhatsApp Chat**  
   Export any WhatsApp group chat from your phone as a `.txt` file.  
   No need to adjust your phone's date/time format – the app handles that automatically.

2. **Upload to ChatViz**  
   Drag and drop or upload your `.txt` file directly in the browser.

3. **Parse & Store**  
   The file is parsed using robust regular expressions, and all data is stored securely in your browser's **local storage**.

4. **Explore the Insights**  
   View charts showing:
   - Who sends the most messages
   - What time of day the group is most active
   - Emoji frequency
   - Word usage patterns
   - And more...

5. **Filter & Search**  
   Refine the data by date range, author, or keywords.

---

## 📦 Installation (for local development)

```bash
git clone https://github.com/Sean-donny/chat-visualiser.git
cd chat-visualiser
npm install
npm run dev
