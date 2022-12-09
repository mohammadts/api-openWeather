//variaveis

const apiKey = ''
const apiCountryURL = 'https://countryflagsapi.com/png/'
const weatherIconURL = 'http://openweathermap.org/img/wn/'
const photoApiKey = ''
const photoUrl = 'https://api.unsplash.com/search/photos?'

const cityInput = document.querySelector('#city-input')
const searchButton = document.querySelector('#search')
const countryFlag = document.querySelector('#country')
const cityName = document.querySelector('#city')
const temperature = document.querySelector('#temperature > span')
const weatherDescription = document.querySelector('#description')
const weatherIcon = document.querySelector('#weather-icon')
const windDescription = document.querySelector('#wind  span')
const humidityDescription = document.querySelector('#humidity  span')
const weatherData = document.querySelector('#weather-data')
const loadingSign = document.querySelector('#loading')

//funções
async function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`
  try {
    let response = await fetch(url)
    let data = await response.json()
    if (data.message == 'city not found') {
      throw new Error('Erro! Cidade não encontrada')
    }
    showWeatherData(data)
    getPhoto(city)
  } catch (e) {
    if (e.message == 'Erro! Cidade não encontrada') {
      loadingSign.innerText = e.message
    } else {
      loadingSign.innerText = 'Erro desconhecido, tente novamente.'
    }
  }
}

async function getPhoto(city) {
  let response = await fetch(
    `${photoUrl}page=1&per_page=1&query=${city}&count=1&client_id=${photoApiKey}`
  )
  let data = await response.json()

  let photo = data.results[0].urls.regular
  document.body.style.cssText =
    `background: url(${photo});` +
    'object-fit: scale-down;' +
    'background-size:cover'
}

const showWeatherData = data => {
  clearWeatherData()
  cityName.innerText = data.name
  temperature.innerText = data.main.temp.toFixed(0)
  weatherDescription.innerText = data.weather[0].description
  windDescription.innerText = `${(data.wind.speed * 3.6).toFixed(0)} km/h`
  humidityDescription.innerText = `${data.main.humidity} %`
  weatherIcon.setAttribute(
    'src',
    `${weatherIconURL}${data.weather[0].icon}.png`
  )
  countryFlag.setAttribute('src', `${apiCountryURL}${data.sys.country}`)
  weatherData.classList.remove('hide')
}

const clearWeatherData = () => {
  cityName.innerText = ''
  temperature.innerText = ''
  weatherDescription.innerText = ''
  windDescription.innerText = ''
  humidityDescription.innerText = ''
  weatherIcon.removeAttribute('src')
  countryFlag.removeAttribute('src')

  loadingSign.classList.add('hide')
}

//eventos
searchButton.addEventListener('click', e => {
  e.preventDefault()
  getWeatherData(cityInput.value.trim())
  weatherData.classList.add('hide')
  loadingSign.classList.remove('hide')
  loadingSign.innerText = 'Carregando...'
})

cityInput.addEventListener('keyup', e => {
  if (e.key == 'Enter') {
    getWeatherData(cityInput.value.trim())
    weatherData.classList.add('hide')
    loadingSign.classList.remove('hide')
    loadingSign.innerText = 'Carregando...'
  }
})

window.addEventListener('offline', e => {
  loadingSign.classList.remove('hide')
  loadingSign.innerText = 'Sem conexão...'
})

window.addEventListener('online', e => {
  loadingSign.classList.add('hide')
})
