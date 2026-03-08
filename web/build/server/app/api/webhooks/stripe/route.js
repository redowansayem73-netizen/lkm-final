(()=>{var e={};e.id=4024,e.ids=[4024],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79428:e=>{"use strict";e.exports=require("buffer")},79646:e=>{"use strict";e.exports=require("child_process")},55511:e=>{"use strict";e.exports=require("crypto")},14985:e=>{"use strict";e.exports=require("dns")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},19771:e=>{"use strict";e.exports=require("process")},27910:e=>{"use strict";e.exports=require("stream")},41204:e=>{"use strict";e.exports=require("string_decoder")},66136:e=>{"use strict";e.exports=require("timers")},34631:e=>{"use strict";e.exports=require("tls")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},78474:e=>{"use strict";e.exports=require("node:events")},8747:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>v,routeModule:()=>b,serverHooks:()=>f,workAsyncStorage:()=>h,workUnitAsyncStorage:()=>y});var o={};r.r(o),r.d(o,{POST:()=>x,runtime:()=>g});var s=r(42706),i=r(28203),a=r(45994),p=r(39187),n=r(56418),d=r(43345),l=r(28474),c=r(47579),u=r(17081),m=r(47811);let g="nodejs";async function x(e){try{let t;let r=await e.text(),o=e.headers.get("stripe-signature");if(!o)return p.NextResponse.json({error:"Missing stripe-signature header"},{status:400});let[s]=await d.db.select().from(l.settings).where((0,c.eq)(l.settings.key,"payment_settings")).limit(1);if(!s?.value)return p.NextResponse.json({error:"Payment settings not configured"},{status:500});let i=JSON.parse(s.value),a=i.stripe?.secretKey,g=i.stripe?.webhookSecret;if(!a||!g)return p.NextResponse.json({error:"Stripe credentials not configured"},{status:500});let x=new n.A(a,{apiVersion:"2025-12-15.clover"});try{t=x.webhooks.constructEvent(r,o,g)}catch(e){return console.error("Webhook signature verification failed:",e),p.NextResponse.json({error:"Invalid signature"},{status:400})}if("payment_intent.succeeded"===t.type){let e=t.data.object,r=e.metadata;if(r.tempReference&&!r.orderId){let t=r.tempReference,o=r.customerName||"Customer",s=r.customerEmail||"",i=r.customerPhone||"",a=r.customerAddress||"",p=parseFloat(r.total||"0"),n=parseFloat(r.subtotal||"0"),g=parseFloat(r.shipping||"0"),x=r.notes||"",b=[];try{b=JSON.parse(r.items||"[]")}catch(e){console.error("Failed to parse items from metadata:",e)}let h=(await d.db.insert(l.orders).values({orderNumber:t,customerName:o,customerEmail:s,customerPhone:i,shippingAddress:a,subtotal:n.toString(),shipping:g.toString(),total:p.toString(),status:"processing",paymentStatus:"paid",paymentMethod:"stripe",stripePaymentIntentId:e.id,notes:x,createdAt:new Date}))[0].insertId;for(let e of b)await d.db.insert(l.orderItems).values({orderId:h,productId:parseInt(e.id),productName:e.name,quantity:e.qty,price:String(e.price),total:String(e.price*e.qty)}),await d.db.update(l.products).set({stock:(0,u.ll)`${l.products.stock} - ${e.qty}`}).where((0,c.eq)(l.products.id,parseInt(e.id)));try{let[e]=await d.db.select().from(l.customers).where((0,c.eq)(l.customers.email,s)).limit(1);e?await d.db.update(l.customers).set({totalOrders:(0,u.ll)`${l.customers.totalOrders} + 1`,totalSpent:(0,u.ll)`${l.customers.totalSpent} + ${p}`,lastOrderDate:new Date,phone:i||e.phone,address:a||e.address}).where((0,c.eq)(l.customers.id,e.id)):await d.db.insert(l.customers).values({email:s,name:o,phone:i||null,address:a||null,totalOrders:1,totalSpent:p.toString(),lastOrderDate:new Date,source:"website"})}catch(e){console.error("Failed to update customer record in webhook:",e)}console.log(`Order ${t} created after successful Stripe payment`);try{await (0,m.m)({orderNumber:t,customerName:o,customerEmail:s,customerPhone:i,shippingAddress:a,items:b.map(e=>({productName:e.name,quantity:e.qty,price:e.price,total:e.price*e.qty})),subtotal:n,total:p,paymentMethod:"stripe"})}catch(e){console.error("Failed to send confirmation email:",e)}}else r.orderId&&(await d.db.update(l.orders).set({paymentStatus:"paid",status:"processing",paymentMethod:"stripe",stripePaymentIntentId:e.id}).where((0,c.eq)(l.orders.id,parseInt(r.orderId))),console.log(`Order ${r.orderId} marked as paid via Stripe webhook`))}if("payment_intent.payment_failed"===t.type){let e=t.data.object,r=e.metadata?.orderId;r&&(await d.db.update(l.orders).set({paymentStatus:"failed"}).where((0,c.eq)(l.orders.id,parseInt(r))),console.log(`Order ${r} payment failed`))}return p.NextResponse.json({received:!0})}catch(e){return console.error("Webhook error:",e),p.NextResponse.json({error:"Webhook handler failed"},{status:500})}}let b=new s.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/webhooks/stripe/route",pathname:"/api/webhooks/stripe",filename:"route",bundlePath:"app/api/webhooks/stripe/route"},resolvedPagePath:"C:\\Users\\ADMIN\\OneDrive\\Documents\\PERSONAL\\DEVELOPMENTS\\LKM\\web\\src\\app\\api\\webhooks\\stripe\\route.ts",nextConfigOutput:"standalone",userland:o}),{workAsyncStorage:h,workUnitAsyncStorage:y,serverHooks:f}=b;function v(){return(0,a.patchFetch)({workAsyncStorage:h,workUnitAsyncStorage:y})}},96487:()=>{},78335:()=>{},47811:(e,t,r)=>{"use strict";r.d(t,{m:()=>s,r:()=>i});var o=r(98721);async function s(e){let t=o.createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),r=e.items.map(e=>`
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${e.productName}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${e.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${Number(e.price).toFixed(2)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${Number(e.total).toFixed(2)}</td>
            </tr>
        `).join(""),s=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; background: #18184b; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Lakemba Mobile King</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Order Confirmation</p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
            <h2 style="color: #18184b; margin-top: 0;">Thank you for your order!</h2>
            <p style="color: #6b7280;">Hi ${e.customerName}, we've received your order and will process it shortly.</p>

            <div style="background: white; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Order Number</p>
                <p style="margin: 0; color: #18184b; font-size: 20px; font-weight: bold;">${e.orderNumber}</p>
            </div>

            <h3 style="color: #18184b; border-bottom: 2px solid #18184b; padding-bottom: 10px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th style="padding: 12px; text-align: left; color: #374151;">Item</th>
                        <th style="padding: 12px; text-align: center; color: #374151;">Qty</th>
                        <th style="padding: 12px; text-align: right; color: #374151;">Price</th>
                        <th style="padding: 12px; text-align: right; color: #374151;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${r}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                        <td style="padding: 12px; text-align: right; font-weight: bold; color: #18184b; font-size: 18px;">$${Number(e.total).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <h3 style="color: #18184b; border-bottom: 2px solid #18184b; padding-bottom: 10px; margin-top: 30px;">Shipping Details</h3>
            <div style="background: white; border-radius: 8px; padding: 15px; border: 1px solid #e5e7eb;">
                <p style="margin: 0 0 5px;"><strong>${e.customerName}</strong></p>
                <p style="margin: 0 0 5px; color: #6b7280;">${e.customerEmail}</p>
                <p style="margin: 0 0 5px; color: #6b7280;">${e.customerPhone}</p>
                <p style="margin: 0; color: #6b7280;">${e.shippingAddress}</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding: 25px; background: #eff6ff; border-radius: 12px; border: 1px solid #bfdbfe;">
                <p style="margin: 0 0 15px; color: #1e40af; font-weight: bold;">Want to see where your order is?</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL||"https://lakembamobile.com.au"}/track-order/${e.orderNumber}" 
                   style="background: #1e40af; color: white; padding: 12px 25px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
                    Track Your Order
                </a>
                <p style="margin: 15px 0 0; color: #60a5fa; font-size: 13px;">Estimated Delivery: 2-3 Business Days</p>
            </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">Lakemba Mobile King</p>
            <p style="margin: 5px 0;">Shop 2/118 Haldon St, Lakemba NSW 2195</p>
            <p style="margin: 5px 0;">Phone: (02) 9740 5353</p>
        </div>
    </div>
    `;try{return await t.sendMail({from:`"Lakemba Mobile King" <${process.env.EMAIL_USER}>`,to:e.customerEmail,subject:`Order Confirmation - ${e.orderNumber}`,html:s}),console.log("Order confirmation email sent to:",e.customerEmail),!0}catch(e){return console.error("Failed to send order confirmation email:",e),!1}}async function i(e){let t=o.createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),r={aus_post:"Australia Post",sendle:"Sendle",startrack:"StarTrack",dhl:"DHL Express",other:"Our Carrier"}[e.shippingProvider||"other"]||"Our Carrier",s=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 25px 0; background: #1e40af; color: white; border-radius: 12px 12px 0 0;">
            <div style="font-size: 40px; margin-bottom: 10px;">🚚</div>
            <h1 style="margin: 0; font-size: 24px;">Your order is on its way!</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Great news! Your package has been shipped.</p>
        </div>

        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px;">Hi ${e.customerName},</p>
            <p style="color: #4b5563; line-height: 1.6;">Good news! We've dispatched your order <strong>${e.orderNumber}</strong>. It's now being handled by <strong>${r}</strong>.</p>

            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px dashed #cbd5e1; text-align: center;">
                <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">Tracking Number</p>
                <p style="margin: 0 0 20px; color: #0f172a; font-size: 24px; font-weight: bold; font-family: monospace; border: 1px solid #e2e8f0; background: white; padding: 10px; display: inline-block;">${e.trackingNumber||"N/A"}</p>
                
                <div style="margin-top: 10px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL||"https://lakembamobile.com.au"}/track-order/${e.orderNumber}" 
                       style="background: #1e40af; color: white; padding: 14px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        Track My Package
                    </a>
                </div>
            </div>

            <div style="grid-template-cols: 1fr 1fr; display: grid; gap: 20px; margin-top: 30px;">
                <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                    <p style="margin: 0 0 5px; color: #64748b; font-size: 12px; text-transform: uppercase;">Carrier</p>
                    <p style="margin: 0; font-weight: bold; color: #1e293b;">${r}</p>
                </div>
                <div style="background: #f1f5f9; padding: 15px; border-radius: 8px;">
                    <p style="margin: 0 0 5px; color: #64748b; font-size: 12px; text-transform: uppercase;">Estimate</p>
                    <p style="margin: 0; font-weight: bold; color: #1e293b;">2-3 Business Days</p>
                </div>
            </div>

            <h3 style="color: #1e293b; margin-top: 35px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Shipping To</h3>
            <p style="color: #4b5563; line-height: 1.5; background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <strong>${e.customerName}</strong><br>
                ${e.shippingAddress}
            </p>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 14px;">Questions? Reply to this email or call us at (02) 9740 5353</p>
            </div>
        </div>

        <div style="text-align: center; padding: 30px; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0; font-weight: bold;">Lakemba Mobile King</p>
            <p style="margin: 5px 0;">Shop 2/118 Haldon St, Lakemba NSW 2195</p>
            <p style="margin: 10px 0;">\xa9 ${new Date().getFullYear()} Lakemba Mobile King. All rights reserved.</p>
        </div>
    </div>
    `;try{return await t.sendMail({from:`"Lakemba Mobile King" <${process.env.EMAIL_USER}>`,to:e.customerEmail,subject:`Shipping Confirmation - Your order ${e.orderNumber} is on its way!`,html:s}),console.log("Shipped confirmation email sent to:",e.customerEmail),!0}catch(e){return console.error("Failed to send shipped confirmation email:",e),!1}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[638,5352,5452,8721,6418,3887],()=>r(8747));module.exports=o})();