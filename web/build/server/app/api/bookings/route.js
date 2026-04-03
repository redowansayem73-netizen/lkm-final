(()=>{var e={};e.id=4190,e.ids=[4190],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79428:e=>{"use strict";e.exports=require("buffer")},79646:e=>{"use strict";e.exports=require("child_process")},55511:e=>{"use strict";e.exports=require("crypto")},14985:e=>{"use strict";e.exports=require("dns")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},19771:e=>{"use strict";e.exports=require("process")},27910:e=>{"use strict";e.exports=require("stream")},41204:e=>{"use strict";e.exports=require("string_decoder")},66136:e=>{"use strict";e.exports=require("timers")},34631:e=>{"use strict";e.exports=require("tls")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},78474:e=>{"use strict";e.exports=require("node:events")},62326:(e,r,s)=>{"use strict";s.r(r),s.d(r,{patchFetch:()=>b,routeModule:()=>g,serverHooks:()=>m,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>x});var t={};s.r(t),s.d(t,{POST:()=>c});var o=s(42706),i=s(28203),n=s(45994),p=s(39187),a=s(43345),u=s(28474),d=s(14120);async function c(e){try{let{brand:r,model:s,issue:t,price:o,bookingDate:i,bookingTime:n,customerName:c,customerEmail:g,customerPhone:l,notes:x}=await e.json();if(!r||!s||!t||!i||!n||!c||!g||!l)return p.NextResponse.json({error:"Missing required fields"},{status:400});await a.db.insert(u.bookings).values({brand:r,model:s,issue:t,price:o?o.toString():null,bookingDate:i,bookingTime:n,customerName:c,customerEmail:g,customerPhone:l,notes:x,status:"pending"});let{transporter:m,user:b}=(0,d.J)("service"),v={from:b,to:process.env.EMAIL_SERVICE||b,subject:`New Repair Booking: ${c} - ${r} ${s}`,html:`
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">New Repair Booking Alert</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p><strong>Customer:</strong> ${c}</p>
                        <p><strong>Email:</strong> ${g}</p>
                        <p><strong>Phone:</strong> ${l}</p>
                        <hr style="border-top: 1px solid #e5e7eb;">
                        <h3>Device Details</h3>
                        <p><strong>Device:</strong> ${r} ${s}</p>
                        <p><strong>Issue:</strong> ${t}</p>
                        <p><strong>Estimated Price:</strong> $${o}</p>
                        <hr style="border-top: 1px solid #e5e7eb;">
                        <h3>Appointment</h3>
                        <p><strong>Date:</strong> ${i}</p>
                        <p><strong>Time:</strong> ${n}</p>
                        <p><strong>Notes:</strong> ${x||"None"}</p>
                    </div>
                </div>
            `},h={from:`"Lakemba Mobile King" <${b}>`,to:g,subject:`Booking Confirmed: ${r} ${s} Repair - Lakemba Mobile King`,html:`
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Booking Confirmed!</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hi ${c},</p>
                        <p>Thank you for booking your repair with <strong>Lakemba Mobile King</strong>!</p>
                        <p>We've successfully received your appointment request. Please review your booking details below:</p>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Device:</strong> ${r} ${s}</p>
                            <p style="margin: 5px 0;"><strong>Reported Issue:</strong> ${t}</p>
                            <p style="margin: 5px 0;"><strong>Estimated Quote:</strong> $${o}</p>
                            <hr style="border-top: 1px solid #e5e7eb; margin: 15px 0;">
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${i}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${n}</p>
                            <p style="margin: 5px 0;"><strong>Store Address:</strong> 85 Haldon St, Lakemba NSW 2195</p>
                        </div>
                        
                        <p>If you need to reschedule or have any questions, simply reply to this email or call us directly at <strong>0410 807 546</strong>.</p>
                        <p>We look forward to seeing you!</p>
                        <br>
                        <p>Best Regards,</p>
                        <p><strong>The Lakemba Mobile King Team</strong></p>
                    </div>
                </div>
            `};return await Promise.all([m.sendMail(v),m.sendMail(h)]),p.NextResponse.json({success:!0,message:"Booking received"},{status:201})}catch(e){return console.error("Booking error:",e),p.NextResponse.json({error:"Failed to process booking",details:e.message||String(e)},{status:500})}}let g=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/bookings/route",pathname:"/api/bookings",filename:"route",bundlePath:"app/api/bookings/route"},resolvedPagePath:"C:\\Users\\ADMIN\\OneDrive\\Documents\\PERSONAL\\DEVELOPMENTS\\LKM\\web\\src\\app\\api\\bookings\\route.ts",nextConfigOutput:"",userland:t}),{workAsyncStorage:l,workUnitAsyncStorage:x,serverHooks:m}=g;function b(){return(0,n.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:x})}},96487:()=>{},78335:()=>{},14120:(e,r,s)=>{"use strict";s.d(r,{J:()=>o});var t=s(98721);function o(e){let r="";switch(e){case"support":r=process.env.EMAIL_SUPPORT||"support@lakembamobileking.com.au";break;case"order":r=process.env.EMAIL_ORDER||"order@lakembamobileking.com.au";break;case"service":r=process.env.EMAIL_SERVICE||"service@lakembamobileking.com.au"}return{transporter:t.createTransport({host:process.env.SMTP_HOST||"smtp.hostinger.com",port:parseInt(process.env.SMTP_PORT||"465"),secure:!0,auth:{user:r,pass:process.env.SMTP_PASSWORD}}),user:r}}}};var r=require("../../../webpack-runtime.js");r.C(e);var s=e=>r(r.s=e),t=r.X(0,[638,5352,5452,8721,3887],()=>s(62326));module.exports=t})();