import { uploadPdf } from "./storage.js";
import { saveExercisesData } from "./db.js";

// 運動項目
const exercises = [
  {
    id: "abdominal_supine",
    name: "腹筋",
    part:"体幹",
    position:"臥位",
    counts: "20回　3セット",
    description: "おへそを見るように頭を上げましょう",
    image: "images/abdominal_supine.png"
  },
  {
    id: "bridge_supine",
    name: "お尻上げ",
    part:"下肢",
    position:"臥位",
    counts: "20回　3セット",
    description: "背中まで上げないように注意して、お尻を上げましょう",
    image: "images/bridge_supine.png"
  },
  {
    id: "chair_stand_stand",
    name: "椅子からの立ち上がり",
    part:"下肢",
    position:"立位",
    counts: "20回　3セット",
    description: "ゆっくり立ち座りしましょう",
    image: "images/chair_stand_stand.png"
  },
  {
    id: "foot_stomp_sit",
    name: "足上げ",
    part:"下肢",
    position:"座位",
    counts: "20回　3セット",
    description: "左右交互に足を上げましょう",
    image: "images/foot_stomp_sit.png"
  },
  {
    id: "foot_stomp_stand",
    name: "足上げ",
    part:"下肢",
    position:"立位",
    counts: "20回　3セット",
    description: "左右交互に足を上げましょう",
    image: "images/foot_stomp_stand.png"
  },
  {
    id: "heel_raise_sit",
    name: "踵あげ",
    part:"下肢",
    position:"座位",
    counts: "20回　3セット",
    description: "左右同時に踵を上げましょう",
    image: "images/heel_raise_sit.png"
  },
  {
    id: "heel_raise_stand",
    name: "踵あげ",
    part:"下肢",
    position:"立位",
    counts: "20回　3セット",
    description: "左右同時に踵を上げましょう",
    image: "images/heel_raise_stand.png"
  },
  {
    id: "hip_abd_supine",
    name: "脚外転",
    part:"下肢",
    position:"臥位",
    counts: "20回　3セット",
    description: "膝を伸ばしたまま交互に足を横に開きましょう",
    image: "images/hip_abd_supine.png"
  },
  {
    id: "hip_abd_stand",
    name: "脚外転",
    part:"下肢",
    position:"立位",
    counts: "20回　3セット",
    description: "膝を伸ばしたまま片方の足を横に開きましょう",
    image: "images/hip_abd_stand.png"
  },
  {
    id: "SLR_supine",
    name: "足上げ",
    part:"下肢",
    position:"臥位",
    counts: "20回　3セット",
    description: "膝を伸ばしたまま足を上げましょう",
    image: "images/SLR_supine.png"
  },
  {
    id: "squat_stand",
    name: "スクワット",
    part:"下肢",
    position:"立位",
    counts: "20回　3セット",
    description: "軽く膝を曲げ伸ばししましょう",
    image: "images/squat_stand.png"
  },
  {
    id: "toe_up_sit",
    name: "つま先あげ",
    part:"下肢",
    position:"座位",
    counts: "20回　3セット",
    description: "左右同時につま先を上げましょう",
    image: "images/toe_up_sit.png"
  },
  {
    id: "elevation_sit",
    name: "腕を上げる運動",
    part:"上肢",
    position:"座位",
    counts: "20回　3セット",
    description: "棒を頭の上まで上げましょう",
    image: "images/elevation_sit.png"
  },
  {
    id: "forward_prot_sit",
    name: "腕を前に伸ばす運動",
    part:"上肢",
    position:"座位",
    counts: "20回　3セット",
    description: "棒を胸の前で持ち、腕を前に伸ばしましょう",
    image: "images/forward_prot_sit.png"
  },
  {
    id: "trunk_rotation_sit",
    name: "体をねじる運動",
    part:"体幹",
    position:"座位",
    counts: "20回　3セット",
    description: "棒を横に振り、体をひねりましょう",
    image: "images/trunk_rotation_sit.png"
  },
  {
    id: "trunk_lateroflex_sit",
    name: "体を横にそらす運動",
    part:"体幹",
    position:"座位",
    counts: "20回　3セット",
    description: "棒を頭の上で持ち、体を横に曲げましょう",
    image: "images/trunk_lateroflex_sit.png"
  }

  
  // 必要ならここに追加
  //　↓↓雛形↓↓
  //{
  //. id:"",
  //. name:"",
  //. part:"",
  //. position:"",
  //. counts: "20回　3セット",
  //. description:"",
  //. image:"images/"
  //}
];

// チェック状態を保持
const selectedExercises = {};
let checkedOrder = [];

// 順番変更関数をグローバル化
window.moveUp = function(index) {
  if (index === 0) return;
  [checkedOrder[index-1], checkedOrder[index]] = [checkedOrder[index], checkedOrder[index-1]];
  renderSelectedList();
};
window.moveDown = function(index) {
  if (index === checkedOrder.length-1) return;
  [checkedOrder[index], checkedOrder[index+1]] = [checkedOrder[index+1], checkedOrder[index]];
  renderSelectedList();
};

// チェック状態更新
function toggleExercises(id, checked) {
  if (!selectedExercises[id]) {
    const ex = exercises.find(e => e.id === id);
    selectedExercises[id] = {
      checked: checked,
      counts: ex.counts,
      description: ex.description
    };
  } else {
    selectedExercises[id].checked= checked;
  }

  if (checked) {
    if (!checkedOrder.includes(id)) checkedOrder.push(id);
  } else {
    checkedOrder = checkedOrder.filter(i => i !== id);
  }
  renderSelectedList();
}

// PDF表示順番変更機能
function renderSelectedList() {
  const container = document.getElementById("selectedList");
  container.innerHTML = "";
  checkedOrder.forEach((id, index) => {
    const ex = exercises.find(e => e.id === id);
    const div = document.createElement("div");
    div.className = "selected-item";
    div.innerHTML = `
      ${ex.name}
      <button onclick="moveUp(${index})">↑</button>
      <button onclick="moveDown(${index})">↓</button>
    `;
    container.appendChild(div);
  });
}

// 運動リスト追加
function renderExercises() {
  const container = document.getElementById("exerciseList");
  container.innerHTML = "";

  const partValue = document.getElementById("partFilter").value;
  const positionValue = document.getElementById("positionFilter").value;
  const keyword = document.getElementById("searchBox").value.toLowerCase();

  exercises
    .filter(ex => {
      return (partValue === "" || ex.part === partValue) &&
             (positionValue === "" || ex.position === positionValue) &&
             (keyword === "" || ex.name.toLowerCase().includes(keyword));
    })
    .forEach(ex => {
      if (!selectedExercises[ex.id]) {
        selectedExercises[ex.id] = {
          checked: false,
          counts: ex.counts,
          description: ex.description
        };
      }
      const div = document.createElement("div");
      div.className = "exercise-item";
      div.innerHTML = `
        <input type="checkbox" class="exercise-checkbox" id="${ex.id}" value="${ex.name}" 
          ${selectedExercises[ex.id]?.checked ? "checked" : ""}>
        <label for="${ex.id}"><strong>${ex.name}</strong> 部位: ${ex.part} 肢位: ${ex.position}</label><br>
        <input id="counts_${ex.id}" type="text" placeholder="回数（例：　10回　3セット）" value="${ex.counts || ""}" style="width:90%"><br>
        <img id="img_${ex.id}" src="${ex.image}" alt="${ex.name}" width="100"><br>
        <textarea id="desc_${ex.id}" rows="3">${ex.description}</textarea>
      `;
      container.appendChild(div);

      // チェックボックスのイベント登録
      div.querySelector(".exercise-checkbox").addEventListener("change", (e) => {
        toggleExercises(ex.id, e.target.checked);
      });
      // 回数入力イベント
      div.querySelector(`#counts_${ex.id}`).addEventListener("input", (e) => {
        selectedExercises[ex.id].counts = e.target.value;
      });
      // 説明文入力イベント
      div.querySelector(`#desc_${ex.id}`).addEventListener("input", (e) => {
        selectedExercises[ex.id].description = e.target.value;
      });
  });
}

// フィルターと検索機能
document.getElementById("partFilter").addEventListener("change", renderExercises);
document.getElementById("positionFilter").addEventListener("change", renderExercises);
document.getElementById("searchBox").addEventListener("input", renderExercises);

// ページ読み込み時に運動を描画
document.addEventListener("DOMContentLoaded", () => {
  renderExercises();
});

// URLからBase64化
async function getImageBase64FromURL(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ヘッダーとフッター追加
function addHeaderFooter(doc, patientName, authorName) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginTop = 60;
  const marginBottom = 40;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // ヘッダー（患者名：中央）
    if (patientName) {
      doc.setFontSize(24);
      doc.text(patientName, pageWidth / 2, marginTop - 30, { align: "center" });
    }

    // フッター（作成者：右寄せ）
    if (authorName && i === pageCount ) {
      doc.setFontSize(28);
      doc.text(authorName, pageWidth - 20, pageHeight - marginBottom + 20, { align: "right" });
    }
  }
  return { marginTop, marginBottom };
}

// PDF作成
async function generatePDFAndSave(selectedExercisesData, preview = false) {
  const { jsPDF } = window.jspdf;

  // selectの値を取得（portrait or landscape）
  const orientationValue = document.getElementById("orientation").value;
  const doc = new jsPDF({
    orientation: orientationValue,
    unit: "pt",
    format: "a4",
  });

  // フォント登録
  // 日本語フォントを埋め込み 
  const fontUrl = "./fonts/NotoSansJP-Regular.ttf";
  const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
  const fontBase64 = btoa( new Uint8Array(fontBytes).reduce((data, byte) => data + String.fromCharCode(byte), "") );
  doc.addFileToVFS("NotoSansJP-Regular.ttf", fontBase64);
  doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
  doc.setFont("NotoSansJP");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ヘッダー＆フッター用の余白を確保
  const patientName = document.getElementById("patientName")?.value || "";
  const authorName  = document.getElementById("authorName")?.value || "";
  const { marginTop, marginBottom } = addHeaderFooter(doc, patientName, authorName);

  // 選択された運動
  const selected = checkedOrder.filter(id => selectedExercises[id]?.checked)
                               .map(id => exercises.find(ex => ex.id === id));

  if (selected.length === 0) {
    alert("運動を選択してください");
    return;
  }

  // 分割数決定
  const count = selected.length
  let rows, cols;
  if (orientationValue === "portrait") {
    if (count === 1) { rows = 1; cols = 1; }
    else if (count === 2) { rows = 2; cols = 1; }
    else if (count === 3) { rows = 3; cols = 1; }
    else { rows = 2; cols = 2; }
  } else {
    if (count === 1) { rows = 1; cols = 1; }
    else if (count === 2) { rows = 1; cols = 2; }
    else if (count === 3) { rows = 1; cols = 3; }
    else { rows = 2; cols = 2; }
  }

  // ここで本文エリアを「余白を除いた範囲」にする
  const contentHeight = pageHeight - marginTop - marginBottom;
  const contentWidth  = pageWidth;

  const cellWidth = contentWidth / cols;
  const cellHeight = contentHeight / rows;

  for (let index = 0; index < selected.length; index++) {
    const exercise = selected[index];
    const row = Math.floor(index / cols);
    const col = index % cols;

    const x = col * cellWidth;
    const y = marginTop + row * cellHeight;
    const w = cellWidth;
    const h = cellHeight;

    let currentY = y + 20;

    // 運動名
    doc.setFontSize(28);
    doc.text(exercise.name, x + w / 2, currentY, { align: "center" });
    currentY += 30;

    //　回数
    const countsVal = selectedExercises[exercise.id]?.counts || exercise.counts;
    doc.setFontSize(24);
    doc.text(countsVal, x + w / 2, currentY, { align: "center" });
    currentY += 20;

    // 画像
    const imgData = await getImageBase64FromURL(exercise.image);
    const maxW = w - 40;
    const maxH = h - 160;
    const img = new Image();
    img.src = imgData;
    await new Promise(resolve => img.onload = resolve);
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const scale = Math.min(maxW / imgW, maxH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const imgX = x + (w - drawW) / 2;
    const imgY = currentY;
    doc.addImage(imgData, "PNG", imgX, imgY, drawW, drawH);
    currentY = imgY + drawH + 30;

    // 説明文
    const descText = selectedExercises[exercise.id]?.description || exercise.description;
    doc.setFontSize(20);
    const textLines = doc.splitTextToSize(descText, w - 40);
    doc.text(textLines, x + w / 2, currentY, { align: "center" });
  }

  if (preview) {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } else {
    const pdfBlob = doc.output("blob");
    doc.save("exercise.pdf");

    // Storageに保存
    const pdfFileId = await uploadPdf(new File([pdfBlob], "exercise.pdf", { type: "application/pdf" }));
    if (!pdfFileId) return;
    // DBに保存
    await saveExercisesData(selectedExercisesData, pdfFileId);
  }
}

// 初期処理
document.addEventListener("DOMContentLoaded", () => {
  renderExercises();

  document.getElementById("generateBtn").addEventListener("click", async () => {
    const selectedExercisesData = checkedOrder
      .filter(id => selectedExercises[id]?.checked)
      .map(id => ({ id, counts: selectedExercises[id].counts, description: selectedExercises[id].description }));

    await generatePDFAndSave(selectedExercisesData, false);
  });

  document.getElementById("previewBtn").addEventListener("click", async () => {
    const selectedExercisesData = checkedOrder
      .filter(id => selectedExercises[id]?.checked)
      .map(id => ({ id, counts: selectedExercises[id].counts, description: selectedExercises[id].description }));

    await generatePDFAndSave(selectedExercisesData, true);
  });
});