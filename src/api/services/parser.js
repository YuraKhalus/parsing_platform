const puppeteer = require('puppeteer');

async function runParser(url) {
   const browser = await puppeteer.launch({
      headless: false,
      args: ['--start-maximized'],
   });
   const page = await browser.newPage();
   await page.setViewport({ width: 1920, height: 1080 });
   await page.goto(url);

   try{
      await page.waitForSelector('h1')
      const sectionSelector = '.similar-colors-products__section-container'
      await page.waitForSelector(sectionSelector, {timeout: 5000});
      const totalSecrions = await page.$$eval(sectionSelector, els => els.length);

      console.log('Знайдено ' + totalSecrions + ' варіантів');

      const allVariantData = [];

      for (let i = 0; i < totalSecrions; i++){
         const sections = await page.$$(sectionSelector);
         const currentSection = sections[i];
         console.log(currentSection);
         
         
         if(!currentSection) continue;

         const isActive = await currentSection.evaluate(el => el.classList.contains('similar-colors-products__section-container--active'));

         if(!isActive){
            try{
               await currentSection.click({ delay: 50 })
               await page.waitForFunction(
                  (index) => {
                     const container = document.querySelectorAll('.similar-colors-products__section-container')[index];
                     const list = container?.querySelector('.similar-series-products__list');
                     return list && list.offsetParent !== null;
                  },
                  { timeout: 4000 },
                  i
               );
               await new Promise(r => setTimeout(r, 500));



            } catch(e){
               console.error(`Помилка при кліку на секцію ${i}: `, e.message);
               continue;
            }
         }

         const sectionData = await page.evaluate((index) => {
            const container = document.querySelectorAll('.similar-colors-products__section-container')[index];

            const groupTitleEl = container.querySelector('.similar-colors-products__section > span');
            const groupName = groupTitleEl ? groupTitleEl.textContent.trim() : 'Невідома характеристика';

            const links = [];

            const linkElements = container.querySelectorAll('.similar-series-products__list a');

            linkElements.forEach(link => {
               links.push({
                  text: link.textContent.trim(),
                  url: link.href,
                  isActive: link.classList.contains('similar-series-products__item--active')
               });
            });

            return {
               groupName,
               options: links
            };
         }, i)
         allVariantData.push(sectionData);
      }

      
      
      
      const data = await page.evaluate(()=> {
         const titleElment = document.querySelector('h1');
         const title = titleElment.textContent.trim();

         const lineElement = document.querySelector('.line');
         const line = lineElement ? lineElement.querySelector('a').textContent.trim() : "Продуктова лінійка не визначена";

         

         let minPrice = 0;
         let maxPrice = 0;
         const priceElement = document.querySelector('.text-orange');
         if(priceElement){
            const minEl = priceElement.querySelector('span:nth-child(1) > span');
            const maxEl = priceElement.querySelector('span:nth-child(3) > span');
            if(maxEl){
               minPrice = Number(minEl.textContent.replace(/\s/g, ''));
               maxPrice = Number(maxEl.textContent.replace(/\s/g, ''));
            }else{
               minPrice = Number(minEl.textContent.replace(/\s/g, ''));
            }
            
         }

         


         
         return {
            product: line,
            fullNameOfProduct: title,
            priseRange: {
               min: minPrice,
               max: maxPrice == 0 ? minPrice : maxPrice
            },
         };

      })

      const result = {
         ...data,
         variants: allVariantData
      }

      console.log(JSON.stringify(result, null, 2));
      
      return result;

   } catch(e){
      console.log('Виникли помилка:', e.message);
   } finally{
      await browser.close();
   }
};

module.exports = { runParser };
