// ===================== รายชื่อนักศึกษา =====================
const students = {
  "6734438":"น.ส. วิภาวดี แต้มคม",
  "6734446":"นาย ณัฐดนัย สิงคีพงศ์",
  "6734453":"นาย นิตินันท์ จันทอง",
  "6734454":"นาย วรธรรม สำเภาทอง",
  "6734455":"นาย ธีรเทพ ติ่งอินทร์",
  "6734458":"น.ส. สิริกร ริดจูงพืช",
  "6734459":"น.ส. กรณิศ วงค์สอาด",
  "6734460":"น.ส. โสภาพร ฉิมนอก",
  "6734461":"น.ส. จีรภา แพงดี",
  "6734462":"นาย พันธุ์ธัช ภัทรมโน"
};

// ===================== เวลาเรียลไทม์ =====================
function updateClock(){
  const now = new Date();
  document.getElementById("clock").innerHTML =
    now.toLocaleDateString('th-TH')+" ⏰ "+ now.toLocaleTimeString('th-TH');
}
setInterval(updateClock,1000);
updateClock();

// ===================== แผนที่ =====================
let map;
const classroom = {lat:13.984967, lng:100.570586};

function initMap(){
  map = new google.maps.Map(document.getElementById("map"),{
    center:classroom,
    zoom:17
  });

  new google.maps.Marker({
    position:classroom,
    map:map,
    label:"🏫"
  });

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      const userPos = {lat: pos.coords.latitude, lng: pos.coords.longitude};
      new google.maps.Marker({
        position: userPos,
        map: map,
        icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });
      map.setCenter(userPos);
    });
  }

  loadHistory();
}

// ===================== ฟังก์ชัน =====================
function findStudent(){
  const id=document.getElementById("studentId").value;
  document.getElementById("studentName").innerHTML =
    students[id]
    ? `<span class="badge">${students[id]}</span>`
    : "❌ ไม่พบรหัสนักศึกษา";
}

function checkIn(){
  const id=document.getElementById("studentId").value;
  if(!students[id]){
    showLog("ไม่พบรหัสนักศึกษา","error");
    return;
  }
  const time = new Date().toLocaleString('th-TH');

  // บันทึกลง localStorage
  let today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  let history = JSON.parse(localStorage.getItem(today)||"[]");
  history.push({id:id, name:students[id], time:time});
  localStorage.setItem(today, JSON.stringify(history));

  showLog(`✔ ${students[id]} เช็คชื่อแล้ว<br>${time}`,"success");
  loadHistory();
}

function showLog(msg,type){
  const el = document.getElementById("studentName");
  el.innerHTML = `<span class="${type}">${msg}</span>`;
}

// โหลดประวัติวันนี้
function loadHistory(){
  let today = new Date().toISOString().split('T')[0];
  let history = JSON.parse(localStorage.getItem(today)||"[]");
  const container = document.getElementById("history");
  container.innerHTML = "";
  history.forEach(item=>{
    const div = document.createElement("div");
    div.className="history-card";
    div.innerHTML=`${item.name} ✅ ${item.time}`;
    container.appendChild(div);
  });
}
