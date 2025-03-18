// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEjpDj4u4q6wovvmGztdTVrntAjHYtQqM",
  authDomain: "ec-site-adbfd.firebaseapp.com",
  projectId: "ec-site-adbfd",
  storageBucket: "ec-site-adbfd.firebasestorage.app",
  messagingSenderId: "379491495680",
  appId: "1:379491495680:web:062c60d9e0b80c141acde5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage(app);//storageの初期化

//要素を取得
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('item-photo');
const preview = document.getElementById('preview');
const cancelButton = document.getElementById("cancel-button");
const registerButton = document.getElementById("register-button");

// ドラッグオーバー時の処理
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});

// ドラッグリーブ時の処理
dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});

// DataTransferItemList を FileList に変換する関数
function dataTransferItemListToFileList(dataTransferItemList) {
  const fileList = [];
  for (let i = 0; i < dataTransferItemList.length; i++) {
    const item = dataTransferItemList[i];
    if (item.kind === 'file') {
      fileList.push(item.getAsFile());
    }
  }
  return fileList;
}

// ドロップ時の処理
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  const files = dataTransferItemListToFileList(e.dataTransfer.items); // 修正: DataTransferItemList を FileList に変換
  console.log(e.dataTransfer.files); // 追加
  console.log(files.length); // 追加
  console.log(files[0]); // 追加
  handleFiles(files);
  // DataTransfer オブジェクトから FileList オブジェクトを作成し、fileInput.files に設定
  const dataTransfer = new DataTransfer();
  files.forEach((file) => {
    dataTransfer.items.add(file);
  });
  fileInput.files = dataTransfer.files;
});

// ファイル選択時の処理
fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  handleFiles(files);
});

// ファイル処理関数
function handleFiles(files) {
  console.log("handleFiles called"); // 追加
  try {
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
  catch (error) {
    console.error("Error in handleFiles:", error); // 追加
  }
}

// ドロップエリアクリックでファイル選択ダイアログを開く
dropArea.addEventListener('click', () => {
  fileInput.click();
});

//取り消しボタンのクリックイベントリスナー
cancelButton.addEventListener("click", () => {
  preview.src = "";
  preview.style.display = "none";
  fileInput.value = "";
});

//送信ボタンを押した際の処理
registerButton.addEventListener("click", async () => {
  //要素を取得
  const itemName = document.getElementById("item-name").value;
  const itemPrice = document.getElementById("item-price").value;
  const file = fileInput.files[0];

  console.log(file);

  try {
    //画像ファイルがある場合の処理
    if (file) {
      const storageRef = ref(storage, 'images/' + file.name); // storageRef を定義
      const snapshot = await uploadBytes(storageRef, file); // uploadBytes の引数を修正
      const downloadURL = await getDownloadURL(snapshot.ref); // 変数名を修正

      const docRef = await addDoc(collection(db, "items"), {
        "item-name": itemName,
        "item-price": parseInt(itemPrice),
        "imageUrl": downloadURL, // 変数名を修正
      });
      console.log("Document written with ID: ", docRef.id);
    } else {
      //画像ファイルがない場合の処理
      const docRef = await addDoc(collection(db, "items"), {
        "item-name": itemName,
        "item-price": parseInt(itemPrice),
      });
      console.log("Document written with ID: ", docRef.id);
    }
  } catch (e) {
    console.error("Error adding document:", e);
  }
});