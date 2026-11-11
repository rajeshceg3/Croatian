const {test,expect}=require('@playwright/test');
test('quiet map by default without an OS motion preference',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
 await page.waitForFunction(()=>!!window.croatiaMap?.getMap());
 expect(await page.evaluate(()=>{const m=croatiaMap.getMap();return[m.options.inertia,m.options.fadeAnimation,m.options.zoomAnimation,m.options.markerZoomAnimation]})).toEqual([false,false,false,false]);
 expect(await page.evaluate(()=>{const m=croatiaMap.getMap();m.flyTo([45,15],10,{animate:true,duration:1.5});return{lat:m.getCenter().lat,lng:m.getCenter().lng,zoom:m.getZoom()}})).toEqual({lat:45,lng:15,zoom:10});
 expect(await page.$eval('body',e=>getComputedStyle(e).animationName)).toBe('none');
 await page.click('#reset-map');expect(await page.evaluate(()=>croatiaMap.getMap().getZoom())).toBe(6);
});
