function go() {
    var skilv = document.getElementById('skill1_level').value;
    var jin1lv = document.getElementById('jinton1_level').value;
    var jin2lv = document.getElementById('jinton2_level').value;
    var str1lv = document.getElementById('strong1_level').value;
    var str2lv = document.getElementById('strong2_level').value;
    var str3lv = document.getElementById('strong3_level').value;
    var str4lv = document.getElementById('strong4_level').value;
    var com1lv = document.getElementById('common1_level').value;

    // 技能核心
    if (isNaN(skilv)) {
        skilv = 0;
    }
    if (skilv >= 30) {
        skilv = 30;
    }
    let skill1_consume = 0;
    for (let i = 0; i < skilv; i++) {
        skill1_consume+= skillArray[i];
    }
    document.getElementById("skill1_consume").innerHTML = skill1_consume;
    document.getElementById("skill1_request").innerHTML = 4400 - skill1_consume;

    // 精通核心1
    if (isNaN(jin1lv)) {
        jin1lv = 0;
    }
    if (jin1lv >= 30) {
        jin1lv = 30;
    }
    let jinton1_consume = 0;
    for (let i = 0; i < jin1lv; i++) {
        jinton1_consume+= jintonArray[i];
    }
    document.getElementById("jinton1_consume").innerHTML = jinton1_consume;
    document.getElementById("jinton1_request").innerHTML = 2252 - jinton1_consume;

    // 精通核心2
    if (isNaN(jin2lv)) {
        jin2lv = 0;
    }
    if (jin2lv >= 30) {
        jin2lv = 30;
    }
    let jinton2_consume = 0;
    for (let i = 0; i < jin2lv; i++) {
        jinton2_consume+= jintonArray[i];
    }
    document.getElementById("jinton2_consume").innerHTML = jinton2_consume;
    document.getElementById("jinton2_request").innerHTML = 2252 - jinton2_consume;

    // 強化核心1
    if (isNaN(str1lv)) {
        str1lv = 0;
    }
    if (str1lv >= 30) {
        str1lv = 30;
    }
    let strong1_consume = 0;
    for (let i = 0; i < str1lv; i++) {
        strong1_consume+= strongArray[i];
    }
    document.getElementById("strong1_consume").innerHTML = strong1_consume;
    document.getElementById("strong1_request").innerHTML = 3383 - strong1_consume;

    // 強化核心2
    if (isNaN(str2lv)) {
        str2lv = 0;
    }
    if (str2lv >= 30) {
        str2lv = 30;
    }
    let strong2_consume = 0;
    for (let i = 0; i < str2lv; i++) {
        strong2_consume+= strongArray[i];
    }
    document.getElementById("strong2_consume").innerHTML = strong2_consume;
    document.getElementById("strong2_request").innerHTML = 3383 - strong2_consume;

    // 強化核心3
    if (isNaN(str3lv)) {
        str3lv = 0;
    }
    if (str3lv >= 30) { 
        str3lv = 30;
    }
    let strong3_consume = 0;
    for (let i = 0; i < str3lv; i++) {
        strong3_consume+= strongArray[i];
    }
    document.getElementById("strong3_consume").innerHTML = strong3_consume;
    document.getElementById("strong3_request").innerHTML = 3383 - strong3_consume;

    // 強化核心4
    if (isNaN(str4lv)) {
        str4lv = 0;
    }
    if (str4lv >= 30) {
        str4lv = 30;
    }
    let strong4_consume = 0;
    for (let i = 0; i < str4lv; i++) {
        strong4_consume+= strongArray[i];
    }
    document.getElementById("strong4_consume").innerHTML = strong4_consume;
    document.getElementById("strong4_request").innerHTML = 3383 - strong4_consume;

    // 共通核心
    if (isNaN(com1lv)) {
        com1lv = 0;
    }
    if (com1lv >= 30) {
        com1lv = 30;
    }
    let common1_consume = 0;
    for (let i = 0; i < com1lv; i++) {
        common1_consume+= commonArray[i];
    }
    document.getElementById("common1_consume").innerHTML = common1_consume;
    document.getElementById("common1_request").innerHTML = 6268 - common1_consume;

    var s_consume = parseInt($("#skill1_consume").html());
    var jn1_consume = parseInt($("#jinton1_consume").html());
    var jn2_consume = parseInt($("#jinton2_consume").html());
    var stn1_consume = parseInt($("#strong1_consume").html());
    var stn2_consume = parseInt($("#strong2_consume").html());
    var stn3_consume = parseInt($("#strong3_consume").html());
    var stn4_consume = parseInt($("#strong4_consume").html());
    var com1_consume = parseInt($("#common1_consume").html());
    let havePieces = parseInt(document.getElementById("havePieces").value);
    havePieces = isNaN(havePieces) ? 0 : havePieces;
    var alln1 = s_consume + jn1_consume + jn2_consume + stn1_consume + stn2_consume + stn3_consume + stn4_consume + com1_consume + havePieces;
    document.getElementById("all").innerHTML = alln1;
    var s_request = parseInt($("#skill1_request").html());
    var jn1_request = parseInt($("#jinton1_request").html());
    var jn2_request = parseInt($("#jinton1_request").html());
    var stn1_request = parseInt($("#strong1_request").html());
    var stn2_request = parseInt($("#strong2_request").html());
    var stn3_request = parseInt($("#strong3_request").html());
    var stn4_request = parseInt($("#strong4_request").html());
    var com1_request = parseInt($("#common1_request").html());
    var alln2 = s_request + jn1_request + jn2_request + stn1_request + stn2_request + stn3_request + stn4_request + com1_request - havePieces;
    document.getElementById("all2").innerHTML = alln2;
    var x;
        x=alln1/287.04;
        document.getElementById("ooo1").innerHTML = x.toFixed(2)+"%";
    var vvv2 = document.getElementById("vvv");
    vvv2.setAttribute('value',alln1);

    if (alln1 > 1) {
        document.getElementById("no1").innerHTML = "那麼少，去唱你的祈禱小米豐收歌啦";
    }
    if (alln1 > 100) {
        document.getElementById("no1").innerHTML = "你等級都比碎片多欸…要不要先去農一下再來算";
    }
    if (alln1 > 200) {
        document.getElementById("no1").innerHTML = "一場lol的小兵數量都比你碎片多";
    }
    if (alln1 > 500) {
        document.getElementById("no1").innerHTML = "是該稱讚你農的不錯，但我不要";
    }
    if (alln1 > 1000) {
        document.getElementById("no1").innerHTML = "誇獎你一下，你真棒嘔嘔嘔嘔嘔嘔";
    }
    if (alln1 > 2000) {
        document.getElementById("no1").innerHTML = "作為玩家你很盡力了很棒，但作為好MS寶，呵廢物";
    }
    if (alln1 > 3000) {
        document.getElementById("no1").innerHTML = "超級武器霸王！要你命三千";
    }
    if (alln1 > 4000) {
        document.getElementById("no1").innerHTML = "破4000，我要派鎖鏈的康妮來對付你！";
    }
    if (alln1 > 5000) {
        document.getElementById("no1").innerHTML = "破5000，沒圖沒證據";
    }
    if (alln1 > 6000) {
        document.getElementById("no1").innerHTML = "破6000，有證據我也不會信";
    }
    if (alln1 > 7000) {
        document.getElementById("no1").innerHTML = "破7000，醒來別做夢";
    }
    if (alln1 > 8000) {
        document.getElementById("no1").innerHTML = "破8…8888888爸爸缺兒子嗎";
    }
    if (alln1 > 9000) {
        document.getElementById("no1").innerHTML = "現代魏忠賢，你這小太監";
    }
    if (alln1 > 10000) {
        document.getElementById("no1").innerHTML = "說謊的孩子沒人要";
    }
    if (alln1 == 28704) {
        document.getElementById("no1").innerHTML = "誇大了吧臭宅。";
    }
    document.getElementById("no2").style.display = "inline-block";
    document.getElementById("no3").style.display = "inline-block";
}

var jintonArray = [
    50,
    15,
    18,
    20,
    23,
    25,
    28,
    30,
    33,
    100,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    175,
    85,
    90,
    95,
    100,
    105,
    110,
    115,
    120,
    125,
    250
];

var skillArray = [
    0,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    200,
    80,
    90,
    100,
    110,
    120,
    130,
    140,
    150,
    160,
    350,
    170,
    180,
    190,
    200,
    210,
    220,
    230,
    240,
    250,
    500
];

var strongArray = [
    75,
    23,
    27,
    30,
    34,
    38,
    42,
    45,
    49,
    150,
    60,
    68,
    75,
    83,
    90,
    98,
    105,
    113,
    120,
    263,
    128,
    135,
    143,
    150,
    158,
    165,
    173,
    180,
    188,
    375
];

var commonArray = [
    125,
    38,
    44,
    50,
    57,
    63,
    69,
    75,
    82,
    300,
    110,
    124,
    138,
    152,
    165,
    179,
    193,
    207,
    220,
    525,
    234,
    248,
    262,
    275,
    289,
    303,
    317,
    330,
    344,
    750
];