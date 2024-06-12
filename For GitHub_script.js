// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/**
 * Config = 機密情報です！！！
 * この部分はGitHubに上げないこと！！！！！！！
 */
//
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const dbRef = ref(database, "chat");//データを入れる階層

//オブジェクトの練習
// const kosuge = {
//   name: "こすげ",
//   age:41,
//   from:"神奈川",

// };
// console.log(kosuge.name);
// console.log(kosuge["from"]);

//送信ボタンを押したとき処理
$("#send").on("click",function(){

  //入力欄のデータを取得
  const userName = $("#userName").val();
  const text = $("#text").val();
  console.log(userName,text);
  const imageStamp = $("#imageStamp").val();
  console.log(imageStamp);

  //送信日時の取得
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth()+1;
  const day = now.getDate();
  const time = now.getHours()+":"+now.getMinutes();
  console.log(year+"/"+month+"/"+day+" "+time);

  
  //送信データをオブジェクトにまとめる
  const message = {
    userName: userName,//key: 変数。最近のjsは同じ時は省略も可
    text: text,
    imageStamp: imageStamp,
    timestamp: year+"/"+month+"/"+day+" "+time
  

  };


  //Firebase realtime Databaseにオブジェクト送信
const newPostRef = push(dbRef);//ユニークキーを生成
set(newPostRef, message);

});

//指定した場所にデータが追加されたことを検知（受信）
onChildAdded(dbRef, function(data){
  //追加されたデータをFirebaseから受け取り、分解
  //ルールに則った分解方法
  const message = data.val(); //DataSnapshot オブジェクトの値を取得
  const key = data.key; //DataSnapshot オブジェクトのキーを取得

  console.log(data, message, key);

  //受信後に送信者の名前によってクラスを設定
  //三項（条件）演算子
  const messageClass = message.userName === "小口沙弥香" ? "self" : "others";

//メッセージをHTMLとして生成するので文字列として作成する必要あり
  let chatMsg = ` 
  <div class="message-bubble ${messageClass}"> 
    <div>${message.userName}</div> 
    <div>${message.text}</div> `; 
    
    
    if(message.imageStamp){
      chatMsg += `<div><img src="${message.imageStamp}" alt="stamp" style="max-width: 100px; max-height: 100px;"></div>`;
    }

    chatMsg +=`<div>${message.timestamp}</div>
  </div> 
  `;
//Firebaseがデータを送り返した時にメッセージを表示
  $("#output").append(chatMsg);

});



