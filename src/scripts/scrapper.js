import { profileSelectors } from "../config/scrapperSelectors";
import { $, $$ } from "../utils/selectors";
import axios from 'axios'

const name = $('h1').textContent
console.log(name)

function getToken(tokenkey) {
    return document.cookie
    .split(';')
    .find(cookie => cookie.includes(tokenkey))
    .replace(tokenkey+'=','')
    .replaceAll('"','')
    .trim()
}

async function getContacInfo(){
    try {
      const token = getToken('JSESSIONID')
      
      const [contactInfoName] = $(profileSelectors.contactInfo).href.match(/in\/.+\/o/g) ?? []
      const contactInfoURL = `https://www.linkedin.com/voyager/api/identity/profiles${contactInfoName.slice(2,-2)}/profileContactInfo`
  
      const {data: {data}} = await axios.get(contactInfoURL, {
        headers:{
        accept: 'application/vnd.linkedin.normalized+json+2.1',
        'csrf-token': token,
        }
      })
      
      return data
    } catch (error) {
      console.log("🚀 ~ file: scrapper.js ~ line 30 ~ getContacInfo ~ error", error)  
    }
  
  }

  function getEspecificInfo (selector) {
    const Elements = $$(selector)
    const titles = []
    Elements.forEach((listItem) => {
        const titleElement = $('span[aria-hidden]', listItem)
        titles.push(titleElement.textContent)
    })
    return titles
  }

  async function scrap () {
    const name = $(profileSelectors.name).textContent
    const experienceTitles = getEspecificInfo(profileSelectors.experiencesElements)
    const educationTitles = getEspecificInfo(profileSelectors.educationElements)
    const contactInfo = await getContacInfo()
    const profile = {
        name,
        contactInfo,
        experienceTitles,
        educationTitles
    }
    console.log(profile)
  }

  scrap()