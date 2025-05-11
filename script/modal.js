function OpenModal(){
    document.getElementById('location').style.display = 'block';
}
function closeLocation(){
    document.getElementById('location').style.display = 'none'
}
function selecteService(){
    document.getElementById('selectService').style.display = 'block';
    document.getElementById('location').style.display = 'none';
}
function BackToState(){
    document.getElementById('location').style.display = 'block';
    document.getElementById('selectService').style.display = 'none';
}
function ShowBedroomList(){
    document.getElementById('BedroomList').style.display = 'block';
    document.getElementById('selectService').style.display = 'none';
}
function BackToSelectService(){
    document.getElementById('selectService').style.display = 'block';
    document.getElementById('BedroomList').style.display = 'none';
}
function showOneTimeCleaning(){
    document.getElementById('onetime').style.display = 'block';
    document.getElementById('BedroomList').style.display = 'none';
}
function BackToBedroom(){
    document.getElementById('onetime').style.display = 'none';
    document.getElementById('BedroomList').style.display = 'block';
}
function ShowSummary(){
    document.getElementById('summary').style.display = 'block';
    document.getElementById('onetime').style.display = 'none';
}
function BackToOnTime(){
    document.getElementById('summary').style.display = 'none';
    document.getElementById('onetime').style.display = 'block'
}
function ShowDate(){
    document.getElementById('showdate').style.display = 'block';
    document.getElementById('summary').style.display = 'none'
}
function BackToSummary(){
    document.getElementById('showdate').style.display = 'none';
    document.getElementById('summary').style.display = 'block'
}
function ShowLogin(){
    document.getElementById('login').style.display = 'block';
    document.getElementById('showdate').style.display = 'none'
}
function BackToDate(){
    document.getElementById('login').style.display = 'none';
    document.getElementById('showdate').style.display = 'block'
}
function ShowCreateAccount(){
    document.getElementById('showaccount').style.display = 'block'
    document.getElementById('login').style.display = 'none';
}
function ShowDeepCleaning(){
    document.getElementById('deepcleaning').style.display = 'block';
    document.getElementById('selectService').style.display = 'none';
}
function BackToSelectServiceTwo(){
    document.getElementById('selectService').style.display = 'block';
    document.getElementById('deepcleaning').style.display = 'none';
}
function ShowRugs(){
    document.getElementById('rugsandcapet').style.display = 'block';
    document.getElementById('selectService').style.display = 'none';
}
function BackToSelectServiceThree(){
    document.getElementById('selectService').style.display = 'block';
    document.getElementById('rugsandcapet').style.display = 'none';
}
function ShowFumigation(){
    document.getElementById('fumigation').style.display = 'block';
    document.getElementById('selectService').style.display = 'none';
}
function BackToFumigation(){
    document.getElementById('fumigation').style.display = 'none';
    document.getElementById('selectService').style.display = 'block';
}