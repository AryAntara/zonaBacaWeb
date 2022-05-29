<script type="module">
//import module  
import {io} from "socket.io-client"
//Core config
let text = "login"
let host = "localhost"
let serverWebSocket = host
let serverApi = "https://dahlahproject.herokuapp.com"
let wssServer = "wss://dahlahproject.herokuapp.com"
let login = true
let intervalAutoSave = ''
let viewContent
let viewContentNow = ''
let amILikeIt
viewContent = false
const changeLogin = ()=>{
  login       = !login
  loginSucces = false
  loginErr    = false
  signErr     = false
  username    = ''
  password    = ''
  email       = ''
  if(login == true){
    userST()
  }
}
"||||||||||||||||||||||||||||||||||||||||||[login and sign up Handle]|||||||||||||||||||||||||||||||||||||||||||||"
let username = ''
let password = ''
let email = ''
let loginSucces = false
let loginErr = false
let signErr = false
let signSucces = false
let loginMode = true
let signErrData = ''
let changeAkun = false
//dashboard
let dashboard = false
//addMode
let addMode = false
//login

///////////////////////////////////////////////////
'DEBUG'
//console.log(viewContent)
//////////////////////////////////////////////////

const loginHandle = async() =>{
  if(username == '' && password == ''){
    return false
  }else{
    const checkUser = await fetch(serverApi+'/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({username,password})
    })
    const dataUser  = await checkUser.json()
    if(dataUser){
      loginSucces = true
      loginErr    = false
      if(localStorage.getItem('saveFile') == null){
        dashboard = true
      }
      loginMode = false
      localStorage.setItem('user',JSON.stringify({username,password}))
      return true
    }else{
      loginSucces = false
      loginErr    = true
      return false
    }
  }
}
const LoadConfiguration = () =>{
 if(localStorage.getItem('saveFile') != null){
  const data = JSON.parse(localStorage.getItem('saveFile'))
      //console.log(data)
  loginMode = data.loginMode
  dashboard = data.dashboard
  addMode = data.addMode
  viewContent = data.viewContent
  viewContentNow = data.viewContentNow
 }
}
const userST = async() =>{
  //login  
  if(localStorage.getItem('user') != null){
      const userss = JSON.parse(localStorage.getItem('user'))
      username = userss.username
      password = userss.password
      loginMode = false
      dashboard = true
      loginSucces = true
      loginErr = false
      LoadConfiguration()
      if(loginHandle() != true ){
          loginErr = false
          loginMode = true
          dashboard = false
          loginSucces = false
          //LoadConfiguration()
      }
  }
}
if(changeAkun == false){
    userST()
}
const signup = async()=>{  
  const nohg = Number(email)
  if(isNaN(nohg)){
    signErr = true
    signErrData = "Ada huruf yang anda masukan"
    return 0
  }
  if(email.length < 11){
    signErr = true
    signErrData = "Nomor yang ada masukan kurang"
    return false
  }
  if(username == '' && password == ''){ 
    signErr = true
    signErrData = 'Input tidak boleh kosong'
    return false
  }else{
    const createUser = await fetch(serverApi+'/signup',{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({username,password,email})
    })
    const response = await createUser.json()
    if(response){
        login = true
        username = ''
        password = ''
        email = ''
    }else{
        signErr = true
        signErrData = "Pengguna telah ada"
      }
    }
}
"////////////////////////////////////////////////[DASHBOARD]////////////////////////////////////////////////"
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let Semua = true
let Pelajaran = false
let Informasi = false 
let Hiburan  = false 
let isCategory = 'all'
let h = ''
let dataToRender = []
let indexIs = ''
let Alldata = ''
let nextAlldata = 6
let afterNext = false
const  nextHandle = () =>{
    const categoryIs = indexIs.category
    const startData = indexIs.length[0]+5
    const endData = indexIs.length[1]+5
    nextAlldata = Alldata - startData     
    if(Alldata >= indexIs.length[0]){
        getData(categoryIs,startData,endData)
        indexIs = {
            category:categoryIs,length:[startData,endData]
        }
        afterNext = true
    }else{
        indexIs = indexIs
    }
}
const  backHandle = () =>{
    const categoryIs = indexIs.category
    const startData = indexIs.length[0]-5
    const endData = indexIs.length[1]-5
    nextAlldata = Alldata + startData
    if(Alldata >= indexIs.length[0]){
        getData(categoryIs,startData,endData)
        indexIs = {
          category:categoryIs,length:[startData,endData]
        }
        afterNext = true
        //console.log('some')
        if(startData == 0){
          afterNext = false
        }
    }else{
        indexIs = indexIs
    }
}

const getData = async(category,i,j) =>{
    const uri = await fetch(serverApi+'/getData',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({category,start:i,end:j})
    })
    const res = await uri.json()
    dataToRender = res[0]
    Alldata = res[1]
    //console.log(Alldata)
}

const semua = () =>{
    getData('all',0,5)
    indexIs = {
        category:'all',length:[0,5]
    }
    isCategory = 'all'
    afterNext = false
    nextAlldata = 6
}
const pelajaran = () =>{
    getData('study',0,5)
    isCategory = 'study'
    indexIs = {
        category:'study',length:[0,5]
    }
    afterNext = false
}
const informasi = () =>{
    getData('information',0,5)
    isCategory = 'information'
    indexIs = {
        category:'information',length:[0,5]
    }
    afterNext = false
}
const hiburan = () =>{
    //console.log('a')
    getData('fun',0,5)
    indexIs = {
        category:'fun',length:[0,5]
    }
    isCategory = 'fun'
    afterNext = false
}
let colorSemua = 'black'
let colorHiburan = 'black'
let colorInformasi = 'black'
let colorPelajaran = 'black'
let watcher 
const startWatcher = () =>{
watcher = setInterval(()=>{
  if(dataToRender.length > 2){
      h = "auto"
    }else{
        h="100%"
      }
  if(isCategory == 'all'){
      colorSemua = '#c9a0ff'
      colorPelajaran = 'black'
      colorInformasi = 'black'
      colorHiburan = 'black'
  }else if(isCategory == 'study'){
      colorSemua = 'black'
      colorPelajaran = '#c9a0ff'
      colorInformasi = 'black'
      colorHiburan = 'black'
  }else if(isCategory == 'information'){
      colorSemua = 'black'
      colorPelajaran = 'black'
      colorInformasi = '#c9a0ff'
      colorHiburan = 'black'
  }else if(isCategory == 'fun'){      
      colorSemua = 'black'
      colorPelajaran = 'black'
      colorInformasi = 'black'
      colorHiburan = '#c9a0ff'
  }
},10)
}
startWatcher()
"//////////////////////////////////////////////////[SEACRH]///////////////////////////////////////////////////////"
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let cariData = ''
const cari = async() =>{
    const query = cariData
    const fetc = await fetch(serverApi+'/findData',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({query,length:'5',start:0,end:4})
      })
    const res = await fetc.json()
    dataToRender = res
    //console.log(res)
    isCategory = 'all'
  }
"[ADD MODE]"
let titleKonten = ''
let isiKonten = ''
let kategoriKonten = 'study'
let watcherKonten = ''
let addModeErr = false
let msgAddModeErr = ''
const saveContent = () => {
    localStorage.setItem('konten',JSON.stringify({titleKonten,isiKonten,kategoriKonten}))
    //console.log(isiKonten)
  }
const addModeSwitch = () =>{
    addMode = true
    dashboard = false
    login = false
    clearInterval(watcher)
    h = 'auto'
  }
const reloadContent = () => {
    if(localStorage.getItem('konten') != null){
        const contentOld = JSON.parse(localStorage.getItem('konten'))
        titleKonten = contentOld.titleKonten
        isiKonten = contentOld.isiKonten
        kategoriKonten = contentOld.kategoriKonten
      }
  }
const backToDashboard = () =>{
    addMode = false
    dashboard = true
    login = false
    addModeErr = false
    viewContent = false
    msgAddModeErr = ''
    startWatcher()
  }
const submitKontent = async() =>{
    let newIsiContent
    if(!isiKonten.includes('\n\n')){
        isiKonten = isiKonten.split('\n').join(' ')
        newIsiContent = [isiKonten]
    }else{
      newIsiContent = isiKonten.split('\n\n').join('#$').split('\n').join(' ').split('#$')
    }
    if(newIsiContent[0].length < 101 || titleKonten == ''){
        addModeErr = true
        msgAddModeErr = 'inputan tidak boleh kosong atau konten terlalu pendek'
        return false
      }
      const allKonten = {
          title:titleKonten,
          owner:username,
          content:newIsiContent,
          category:kategoriKonten,
          like:0,
          people:[],
        }
      titleKonten = ''
      kategoriKonten = 'study'
      isiKonten = ''
      //console.log(allKonten)

      const newRequest = await fetch(serverApi+'/addData',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(allKonten)
        })
      const newRespons = await newRequest.json()
      socket.emit('update',"data")
  }
   //import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"
  //console.log(io)
  const socket = io.connect(wssServer)
  socket.on('dataUpdate',((data)=>{
      semua()
      //console.log(dataToRender)
    }))

reloadContent()
"//////////////////////////////////////////////////////[VIEW]///////////////////////////////////////////////////////"
//let viewContentNow = ''
const viewHandle = async(id)=>{
    if(id == undefined){
        return 0
      }
    clearInterval(watcher)
    //console.log(id)
    const newRequest = await fetch(serverApi+'/viewHandle/'+id,{method:'GET'})
    const newRespons = await newRequest.json()
    viewContentNow = newRespons
    //console.log(newRespons)
    viewContent = true
    addMode = false
    loginMode = false
    dashboard = false
  }

const autoSave = () => { 
    intervalAutoSave = setInterval(()=>{
      const session = {
        viewContent,
        addMode,
        dashboard,
        loginMode,
        viewContentNow
      }
      //viewContent = true
      //console.log(session)
      localStorage.setItem('saveFile',JSON.stringify(session))
      saveContent()

      if(viewContent == false && addMode == false && dashboard == false && loginMode == false){
          dashboard = true
        }
    },1000)
  }
autoSave()
semua()
//Load()

"/////////////////////////////////////////////////[LIKE dan COMENT HANDLE]////////////////////////////////////////"
amILikeIt = false
let like = ''
let likeClick = (id,likeCount,people) => {
  //console.log(amILikeIt)
    if(amILikeIt == false){
      amILikeIt = true
      let type = 'like'
      socket.emit('like',{type,id,indexIs,username})
      
    }else{
        amILikeIt = false
        let type = 'dislike'
        socket.emit('like',{type,id,indexIs,username})
      }
  }
socket.on('likeData',(data) =>{
    const startData = data.indexIs.length[0]
    const endData   = data.indexIs.length[1]
    if(startData == indexIs.length[0] && endData == indexIs.length[1]){
        dataToRender = data.data
    }
  })
</script>
<main style="min-height:100vh;">
{#if loginMode}
<div>
    <center>
      <h2 class='zonabaca'>ZONA BACA</h2>
      <span class='text-info'>Budayakan membaca</span>
    {#if login}
        {#if loginErr}
            <div class="login-err">Pengguna tidak di temukan</div>
        {/if}
    <div class="container">
       <input bind:value={username} type="text" placeholder="Pengguna" required>
      <input bind:value={password} type="password" placeholder="Sandi" required>
      <div on:click={loginHandle} class="btn-login">Masuk</div>
      <p class="sambutan"> masuk dengan akun mu.</p>
      <h3> atau </h3>
      <div on:click={changeLogin} class="btn-daftar">Daftar</div>
    </div>
    {:else}
        {#if signErr}
            <div class="sign-err">{signErrData}</div>
        {/if}
   <div class="container">
      <input bind:value={email} type="email" placeholder="No hp" required>
      <input bind:value={username} type="text" placeholder="Pengguna" required>
      <input bind:value={password} type="password" placeholder="Sandi">
      <div on:click={signup} class="btn-daftar">Daftar</div>
      <p class="sambutan">buat akun baru.</p>
      <h3> atau </h3>
      <div on:click={changeLogin} class="btn-login">Masuk</div>
    </div>
    {/if}
    </center>
</div>
{/if}
{#if dashboard}
<center>
  <div>
    <h2 class="dashboard-h2">ZONA BACA</h2>
    <p class="text-info">Budayakan membaca</p>
    <div class="search">
      <input bind:value={cariData} class="inp-search" type="text" placeholder="search">
      <div on:click={cari} class="btn-seacrh">
        <img alt="halo" src="/icon-search.png" width='20px' height="20px">
      </div>
      <div on:click={addModeSwitch} class="add-seacrh">+</div>
    </div>
    <div class="category">
      <span on:click={semua} style="color:{colorSemua}">Semua</span>
      <span on:click={hiburan} style="color:{colorHiburan}" href="">Hiburan</span>
      <span on:click={pelajaran} style="color:{colorPelajaran}">Pelajaran</span>
      <span on:click={informasi} style="color:{colorInformasi}">Informasi</span>
    </div>
    {#if dataToRender.length == 0}
      <p style="color:rgba(0,0,0,0.5);line-height:28px">konten kosong. Buat baru dengan klik icon '+' diatas.</p>
    {/if}
  <div class="content-container">
    {#each dataToRender as i}
    {#if i.category == "study"}
    <div class="content" style="background-color:#ccffff">
      <h3>{i.title}</h3>      
      <p on:click={viewHandle(i.idToken)} class="title">dibuat oleh {i.owner}</p>
      <p on:click={viewHandle(i.idToken)} class="contents" >{i.content.slice(0,97)}...</p>
      <p on:click={likeClick(i.idToken,i.like)} class="suka">{i.people.find(e => e == username) ? 'Menyukai' : 'Sukai' }</p> 
      <p class="allSuka">{i.like} orang menyukai.</p>
    </div> 
    {:else if i.category == 'information'}
    <div  class="content" style="background-color:#ffff00">
      <h3>{i.title}</h3>
      <p on:click={viewHandle(i.idToken)} class="title">dibuat oleh {i.owner}</p>
      <p on:click={viewHandle(i.idToken)} class="contents" >{i.content.slice(0,97)}...</p>
      <p on:click={likeClick(i.idToken,i.like)} class="suka">{i.people.find(e => e == username) ? 'Menyukai' : 'Suka' }</p> 
      <p class="allSuka">{i.like} orang menyukai.</p>
     </div>
    {:else if i.category == 'fun'}
    <div  class="content" style="background-color:#c9a0ff">
      <h3>{i.title}</h3>
      <p on:click={viewHandle(i.idToken)} class="title">dibuat oleh {i.owner}</p>
      <p on:click={viewHandle(i.idToken)} class="contents" >{i.content.slice(0,97)}...</p>
      <p on:click={likeClick(i.idToken,i.like)} class="suka">{i.people.find(e => e == username) ? 'Menyukai' : 'Suka' }</p> 
      <p class="allSuka">{i.like} orang menyukai.</p>
 
    </div>
  {/if}
    {/each}
  </div>
  <div class="parrent-nav">
   {#if afterNext}
    <div class="nav">
      <span on:click={backHandle} class="back"> kembali </span>
    </div>
  {/if}
  {#if dataToRender.length == 5 && nextAlldata > 5}
    <div class="nav">
     <span on:click={nextHandle} class="next"> lanjut </span>
    </div>
  {/if}
  </div>
  </div>
</center>
{/if}
{#if addMode}
<div class="addMode">
  <div on:click={backToDashboard} class="back-add">kembali</div>
{#if addModeErr}
  <div style="
  background-color:white;
  text-align:center;
  line-height:24px;
  margin-top:24px;
  width:100%;
  color:red;">{msgAddModeErr}</div>
{/if}

  <table>
  <tr>
    <td class="add-pembuat">Pembuat</td>
    <td><p><span>{username}</span></p></td>
  </tr>
  <tr>
    <td>Kategori</td> 
    <td><select bind:value={kategoriKonten}>
      <option value="information">Informasi</option>
      <option value="study">Pelajaran</option>
      <option value="fun">Hiburan</option>
    </select></td>
  </tr>
  <tr>
    <td>Title</td> 
    <td><input placeholder="judul" bind:value={titleKonten}></td>
  </tr>
  <tr>
    <td>Konten</td> 
    <td><p class="info">* tips enter 2 kali untuk baris baru dan konten minimal 100 karakter.</p><textarea on:change={saveContent} bind:value={isiKonten}></textarea></td>
  </tr>
  </table>
  <div class="btn-send" on:click={submitKontent}> kirim </div>
</div>
{/if}
{#if viewContent}
  <div on:click={backToDashboard} class="back-add">kembali</div>
  <center>
  <div class="content-container">
   {#each viewContentNow as i}
    {#if i.category == "study"}
    <div class="content" style="background-color:#ccffff">
      <h3>{i.title}</h3>
      <p class="title">dibuat oleh {i.owner}</p>
      {#each i.content as k}
        <p class="contents" >{k}</p>
      {/each}
    </div>
    {:else if i.category == 'information'}
    <div class="content" style="background-color:#ffff00">
      <h3>{i.title}</h3>
      <p class="title">dibuat oleh {i.owner}</p>
      {#each i.content as k}
        <p class="contents" >{k}</p>
      {/each}
 
    </div>
    {:else if i.category == 'fun'}
    <div  class="content" style="background-color:#c9a0ff">
      <h3>{i.title}</h3>
      <p class="title">dibuat oleh {i.owner}</p>
      {#each i.content as k}
        <p class="contents" >{k}</p>
      {/each}
    </div>
  {/if}
  {/each}
  </div>
  </center>
{/if}
</main>

<style>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans&display=swap');
.allSuka{
    margin-top:4px;
    color:rgba(0,0,0,0.5)
}
.suka{
    background-color:white;
    width:80px;
    text-align:center;
    border-radius:8px;
    padding:8px;
    cursor:pointer;
    margin-top:16px;
    margin-bottom:8px;
    box-shadow:0px 2px 2px rgba(0, 0, 0, 0.2)
  }
hover.suka{
    color:red;
  }
.btn-login{
    cursor:pointer;
  }
.btn-daftar{
    cursor:pointer;
  }
.btn-send{
    cursor:pointer;
  }
.btn-seacrh{
    cursor:pointer;
  }
.back-add{
    cursor:pointer;
  }
.category{
    cursor:pointer;
  }
.add-seacrh{
    cursor:pointer;
  }
.nav span.next{
    cursor:pointer;
  }
.nav span.back{
    cursor:pointer;
  }
.content p.title{
    cursor:pointer;
  }
.content h3 {
    cursor:pointer;
  }
.content p.contents{
    cursor:pointer;
  }
@media (max-width:500px){
.parrent-nav {
    align-items:center;
    justify-content:center;
    display:flex;
  }
.addMode table {
    margin-top:16px;
  }
.addMode table tr td p.info{
    color:rgba(0,0,0,0.5);
    font-size:12px;
  }
.addMode div {
    text-align:center;
    background-color:#ccffff;
    padding:4px;
    height:auto;
    border-radius:4px;
    padding-top:8px;
    padding-bottom:8px;
  }
.addMode table tr td textarea{
    height:300px;
    width:240px;
    }
.addMode table tr td input{
    background-color:white;
  }
.addMode table tr td select {
    background-color:white;
  }  
.addMode p span{
    margin-top:16px;
    font-weight:bold;
    color:black;
    background-color:#ccffff;
    padding:8px;
    border-radius:4px;
  }
.addMode p select{
    background-color:#ccffff;
    border:none;
    border-radius:4px;
  }
.back-add{
    display:flex;
    background-color:#ccffff;
    width:64px;
    align-items:center;
    justify-content:center;
    height:auto;
    padding:8px;
    padding-left:2px;
    padding-right:2px;
    text-align:center;
    border-radius:4px;
  }
.nav span.back{
    background-color:#ccffff;
    padding:8px;
    border-radius:2px;
  }

.nav span.next{
    background-color:#ccffff;
    padding:8px;
    border-radius:2px;
  }
.nav span{
    margin-right:16px;
    margin-left:16px;
  }
.nav{
    margin-top:28px;
  }
.category span{
    margin-left:3px;
    margin-right:3px;
  }
.content p.contents{
    margin-bottom:4px;
    line-height:24px;
  }
.content p.title{
    margin-top:8px;
    color:rgba(0,0,0,0.5)
  }
.content h3{
    padding-top:10px;
    font-size:24px;
    margin-bottom:2px;
    margin-top:2px
  }
.content{
    margin-left:0px;
    word-wrap:break-word;
    padding-top:2px;
    text-align:left;
    margin-left:0px;
    margin-right:0px;
    padding-left:16px;
    padding-right:40px;
    margin-top:24px;
    border-radius:4px;
    padding-bottom:20px;
    margin-bottom:0px;
    width:240px;
  }
.category{
  padding-top:16px;
  padding-bottom:8px;
  }
.add-seacrh{
    font-size:28px;
    background-color:#ccffff;
    padding-left:10px;
    padding-right:10px;
    border-radius:4px;
    margin-left:8px;
    width:22px;
  }
.content-container{
    display:block; 
  }
.inp-search{
    width:180px;
    padding:4px;
    padding-left:8px;
    margin:0px;
    height:36px;
    border-radius:8px;
    margin-width:14px;
  }
.btn-seacrh{
    width:28px;
    padding:6px;
    margin-left:8px;
    background-color:#ccffff;
    border-width:2px;
    border-radius:4px;
  }
.search{
    align-items:center;
    justify-content:center;
    display:flex;
    background-color:white;
    padding:4px;
    padding-left:12px;
    border-radius:8px; 
    padding-right:0px;
  }
.dashboard-h2{
    margin-top:6px;
    margin-bottom:2px;
  }

main{
    background-color:white;
    padding:20px;
    margin-top:0px;
    border-radius:8px;
    box-shadow: 0px 10px 20px rgb(0 0 0 / 0.2);
    font-family:'PT Sans',sans-serif;
  }
input{
    width:216px;
    padding:8px;
  }
.login-err{
    color: red;
    padding: 10px;
    margin-top:14px;
    margin-bottom: 12px;
    text-align:center;
  }
.sign-err{
    color: red;
    padding: 10px;
    margin-top: 14px;
    margin-bottom: 12px;
    text-align:center;
  }
.zonabaca{
    margin-top:100px;
    margin-bottom:4px;
  }
.text-info{
    margin:4px;
    margin-bottom:16px;
    color:#808080;
  }
.container{
    margin-top:40px;
  }
.btn-login{
    background-color:black;
    padding:8px;
    width:198px;
    color:white;
    border-radius:4px;
    text-align:center;
    font-weight:bold;
    box-shadow: 0px 10px 20px rgb(0 0 0 / 0.2);
 }
.btn-daftar{
    background-color:#73C2FB;
    padding:8px;
    width:198px;
    color:white;
    border-radius:4px;
    text-align:center;
    font-weight:bold;
    box-shadow: 0px 10px 20px rgb(0 0 0 / 0.2);
  }
}
@media (min-width:501px){
 div.back-add{
    display:flex;
    background-color:#ccffff;
    width:72px;
    align-items:center;
    justify-content:center;
    height:auto;
    padding:8px;
    padding-left:2px;
    padding-right:2px;
    text-align:center;
    border-radius:4px;
  }

.addMode div.btn-send{
    display:flex;
    width:60px;
    justify-content:center;
    align-items:center;
  }
.parrent-nav {
    align-items:center;
    justify-content:center;
    display:flex;
  }
.addMode table {
    margin-top:16px;
  }
.addMode table tr td p.info{
    color:rgba(0,0,0,0.5);
    font-size:12px;
  }
.addMode div {
    text-align:center;
    background-color:#ccffff;
    padding:4px;
    width:46px;
    height:20px;
    border-radius:4px;
    padding-top:8px;
    padding-bottom:8px;
  }
.addMode table tr td textarea{
    height:300px;
    width:400px;
    }
.addMode table tr td input{
    background-color:white;
  }
.addMode table tr td select {
    background-color:white;
  }  
.addMode p span{
    margin-top:16px;
    font-weight:bold;
    color:black;
    background-color:#ccffff;
    padding:8px;
    border-radius:4px;
  }
.addMode p select{
    background-color:#ccffff;
    border:none;
    border-radius:4px;
  }
.addMode div.back-add{
    display:flex;
    background-color:#ccffff;
    width:72px;
    align-items:center;
    justify-content:center;
    height:auto;
    padding:8px;
    padding-left:2px;
    padding-right:2px;
    text-align:center;
    border-radius:4px;
  }
.nav span.back{
    background-color:#ccffff;
    padding:8px;
    border-radius:2px;
  }

.nav span.next{
    background-color:#ccffff;
    padding:8px;
    border-radius:2px;
  }
.nav span{
    margin-right:16px;
    margin-left:16px;
  }
.nav{
    margin-top:28px;
  }
.category span{
    margin-left:3px;
    margin-right:3px;
  }
.content p.contents{
    margin-bottom:4px;
    line-height:24px;
  }
.content p.title{
    margin-top:8px;
    color:rgba(0,0,0,0.5)
  }
.content h3{
    padding-top:10px;
    font-size:24px;
    margin-bottom:2px;
    margin-top:2px
  }
.content-container{
    display:flex;
    justify-content:center;
    align-items:center;
    max-width:78%;
    flex-wrap:wrap;
  }
.content{
    word-wrap:break-word;
    padding-top:2px;
    text-align:left;
    margin-left:20px;
    max-width:200px;
    margin-right:20px;
    padding-left:16px;
    padding-right:40px;
    margin-top:24px;
    border-radius:4px;
    padding-bottom:20px;
    margin-bottom:0px;
  }
.category{
  padding-top:16px;
  padding-bottom:8px;
  }
.add-seacrh{
    font-size:28px;
    background-color:#ccffff;
    padding-left:10px;
    padding-right:10px;
    border-radius:4px;
    margin-left:8px;
    width:22px;
  }
.inp-search{
    width:180px;
    padding:4px;
    padding-left:8px;
    margin:0px;
    height:36px;
    border-radius:8px;
    margin-width:14px;
  }
.btn-seacrh{
    width:28px;
    padding:6px;
    margin-left:8px;
    background-color:#ccffff;
    border-width:2px;
    border-radius:4px;
  }
.search{
    align-items:center;
    justify-content:center;
    display:flex;
    background-color:white;
    padding:4px;
    padding-left:12px;
    border-radius:8px; 
    padding-right:0px;
  }
.dashboard-h2{
    margin-top:6px;
    margin-bottom:2px;
  }

main{
    background-color:white;
    padding:20px;
    margin-top:0px;
    border-radius:8px;
    box-shadow: 0px 10px 20px rgb(0 0 0 / 0.2);
    font-family:'PT Sans',sans-serif;
  }
input{
    width:216px;
    padding:8px;
  }
.login-err{
    color: red;
    padding: 10px;
    margin-top:14px;
    margin-bottom: 14px;
    text-align:center;
  }
.sign-err{
    color: red;
    padding: 10px;
    margin-top: 14px;
    margin-bottom: 14px;
    text-align:center;
  }
.zonabaca{
    margin-top:100px;
    margin-bottom:4px;
  }
.text-info{
    margin:4px;
    margin-bottom:16px;
    color:#808080;
  }
.container{
    margin-top:40px;
    display:grid;
    align-items:center;
    justify-content:center;
  }
.btn-login{
    background-color:black;
    padding:8px;
    width:198px;
    color:white;
    border-radius:4px;
    text-align:center;
    font-weight:bold;
    box-shadow: 0px 10px 20px rgb(0 0 0 / 0.2);
 }
.btn-daftar{
    background-color:#73C2FB;
    padding:8px;
    width:198px;
    color:white;
    border-radius:4px;
    text-align:center;
    font-weight:bold;
    box-shadow: 0px 10px 20px rgb(0 0 0 / 0.2);
  }
}
.sambutan{
  padding:4px;
  margin-top:1px;
  margin-bottom:0px;
  color:rgb(0 0 0/ 0.6)
  }
</style>
