const myRequest ='https://api.lyrics.ovh/suggest/';
const song = document.getElementById('song');
const lyric = document.getElementById('lyric');


function fetchLyrics(i){
  var artist=document.getElementById(i+"song-title").innerHTML;
  var title=document.getElementById(i+"song-artist").innerHTML;
  console.log(artist+title);
  displaynone('song');

  document.getElementById("songlyrics").innerHTML=artist+"-"+title;
  displayblock('gobackbtn');
  displayblock('lyric');
  
  const lyricsApiUrl = 'https://api.lyrics.ovh/v1/'+artist+'/'+title;
  
  fetch(lyricsApiUrl)
  .then(function(response) {
      return response.json();
  }).then(function(data) {
      console.log(data);
      document.getElementById("lyricstitle").innerHTML=artist+"-"+title;
      
      
      if(data.lyrics==""){
        var mainlyrics="No Lyrics Found";
      }else{
       var mainlyrics=data.lyrics;
      }
      document.getElementById("songlyrics").innerHTML=mainlyrics;

       
  }).catch(function(error) {
      console.log(error); 
    });
}
function makeLoopofArry(data){
  document.getElementById("song").innerHTML="";
    var maindata=data.data;
    for (i = 0; i < maindata.length; i++) {
     document.getElementById("song").innerHTML +=  
        '<div class="song"><div class="song-body"><b><span id="'+i+'song-title">'+maindata[i]['title']+'</span></b>(<span id="'+i+'song-artist">'+maindata[i]['artist']['name']+'</span>)<a class="btn btn-success" onclick="fetchLyrics('+i+')">Show Lyrics</a> </div></div>'; 
      }
      document.getElementById("nextbtnc").value=data.next;
      
}

function  getSearchRecord(){
  
  var q=document.getElementById("searchtext").value;
  document.getElementById("song").innerHTML="";
    fetch(myRequest+q)
    .then(response => response.json())
    .then(data =>makeLoopofArry(data))
    displayblock('song');
  displaynone('gobackbtn');
  displaynone('lyric');
  displayblock('nextbtn');
 }

 function paginationSong() {
   
   var urlApi=document.getElementById("nextbtnc").value;
  fetch(`https://cors-anywhere.herokuapp.com/${urlApi}`)
  .then(response => response.json())
  .then(data =>makeLoopofArry(data))
    
 
}

 function displaynone(id){
  document.getElementById(id).style.display='none';
};

function displayblock(id){
  document.getElementById(id).style.display='block';
};

function goBackBtn(){
  displayblock('song');
  displaynone('gobackbtn');
  displaynone('lyric');
}