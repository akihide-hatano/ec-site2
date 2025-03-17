const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('item-photo');
const preview = document.getElementById('preview');
const cancelButton = document.getElementById("cancel-button");

// ドラッグオーバー時の処理
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});

// ドラッグリーブ時の処理
dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});

// ドロップ時の処理
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  const files = e.dataTransfer.files;
  handleFiles(files);
});

// ファイル選択時の処理
fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  handleFiles(files);
});

// ファイル処理関数
function handleFiles(files) {
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      alert('画像ファイルを選択してください。');
    }
  }
}

// ドロップエリアクリックでファイル選択ダイアログを開く
dropArea.addEventListener('click', () => {
  fileInput.click();
});

//取り消しボタンのクリックイベントリスナー
cancelButton.addEventListener("click",()=>{
    preview.src ="";
    preview.style.display = "none";
    fileInput.value = "";
});