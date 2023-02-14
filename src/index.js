import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo= document.querySelector('.country-info')
function clearAll(){
    
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}
const DEBOUNCE_DELAY = 300;

let countryName = '';

function fetchCountries(nameInr){
    console.log(nameInr)
    const URL = `https://restcountries.com/v3.1/name/${nameInr}?fields=name,capital,population,flags,languages`
    const item = fetch(URL).then(res =>res.json())
    console.log(item);
    return item;
}
function createCountryList(arr){
    let liEl = arr
    .map(c => `<li>
    <img src="${c.flags.svg}" alt="Country flag" width="40", height="30">
    <span class="country-list--name">${c.name.official}</span>
    </li>`);
    countryList.insertAdjacentHTML('beforeend',liEl);

}

function countryInfoCard(country){
    countryInfo.innerHTML = ` <span class="flag"><h2><img src="${country.flags.svg}" alt="">${country.name.common}</h2></span>
    <div className="desc-block">
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Languages: ${Object.values(country.languages).join(", ")}</p>
    </div>`
}

function inputHandler(e){
    countryName = inputCountry.value.trim();
    if(countryName ===''){
        clearAll();
        return;
    }else fetchCountries(countryName).then(countryNames =>{
        if(countryNames.length <2){
            /// create card[0]
            clearAll();
            countryInfoCard(countryNames[0])
        }else if(countryNames.length < 10 && countryNames.length > 1){
            createCountryList(countryNames);
            //notify OK
            Notify.success("OK")
        }else{
            clearAll();
            //notify too many matches
            Notify.failure("Failed:too many matches")
        };
    }).catch(() => Notify.failure("Country not found"))
}

inputCountry.addEventListener('input',debounce(inputHandler,DEBOUNCE_DELAY))

