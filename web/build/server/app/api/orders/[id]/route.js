(()=>{var e={};e.id=7413,e.ids=[7413],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},79428:e=>{"use strict";e.exports=require("buffer")},79646:e=>{"use strict";e.exports=require("child_process")},55511:e=>{"use strict";e.exports=require("crypto")},14985:e=>{"use strict";e.exports=require("dns")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},19771:e=>{"use strict";e.exports=require("process")},27910:e=>{"use strict";e.exports=require("stream")},41204:e=>{"use strict";e.exports=require("string_decoder")},66136:e=>{"use strict";e.exports=require("timers")},34631:e=>{"use strict";e.exports=require("tls")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},78474:e=>{"use strict";e.exports=require("node:events")},79415:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>f,routeModule:()=>x,serverHooks:()=>h,workAsyncStorage:()=>g,workUnitAsyncStorage:()=>b});var o={};t.r(o),t.d(o,{GET:()=>u,PATCH:()=>m});var i=t(42706),s=t(28203),d=t(45994),a=t(39187),p=t(43345),n=t(28474),l=t(47579),c=t(47811);async function u(e,{params:r}){try{let e;let{id:t}=await r;if(/^\d+$/.test(t)){let r=parseInt(t);[e]=await p.db.select().from(n.orders).where((0,l.eq)(n.orders.id,r)).limit(1)}else[e]=await p.db.select().from(n.orders).where((0,l.eq)(n.orders.orderNumber,t)).limit(1);if(!e)return a.NextResponse.json({error:"Order not found"},{status:404});let o=await p.db.select({id:n.orderItems.id,productId:n.orderItems.productId,productName:n.orderItems.productName,quantity:n.orderItems.quantity,price:n.orderItems.price,total:n.orderItems.total,refundedQuantity:n.orderItems.refundedQuantity}).from(n.orderItems).where((0,l.eq)(n.orderItems.orderId,e.id)),i=await p.db.select().from(n.orderRefunds).where((0,l.eq)(n.orderRefunds.orderId,e.id));return a.NextResponse.json({order:e,items:o,refunds:i})}catch(e){return console.error("Error fetching order:",e),a.NextResponse.json({error:"Failed to fetch order"},{status:500})}}async function m(e,{params:r}){try{let{id:t}=await r,o=parseInt(t),i=await e.json(),s={};if(i.status&&(s.status=i.status),i.paymentStatus&&(s.paymentStatus=i.paymentStatus),void 0!==i.paymentMethod&&(s.paymentMethod=i.paymentMethod),void 0!==i.notes&&(s.notes=i.notes),void 0!==i.trackingNumber&&(s.trackingNumber=i.trackingNumber),void 0!==i.shippingProvider&&(s.shippingProvider=i.shippingProvider),void 0!==i.customerName&&(s.customerName=i.customerName),void 0!==i.customerPhone&&(s.customerPhone=i.customerPhone),void 0!==i.shippingAddress&&(s.shippingAddress=i.shippingAddress),void 0!==i.stripePaymentIntentId&&(s.stripePaymentIntentId=i.stripePaymentIntentId),0===Object.keys(s).length)return a.NextResponse.json({error:"No valid fields to update"},{status:400});await p.db.update(n.orders).set(s).where((0,l.eq)(n.orders.id,o));let[d]=await p.db.select().from(n.orders).where((0,l.eq)(n.orders.id,o)).limit(1);if("shipped"===i.status&&d)try{let e=await p.db.select().from(n.orderItems).where((0,l.eq)(n.orderItems.orderId,d.id));await (0,c.r)({orderNumber:d.orderNumber||"",customerName:d.customerName||"",customerEmail:d.customerEmail||"",customerPhone:d.customerPhone||"",shippingAddress:d.shippingAddress||"",items:e.map(e=>({productName:e.productName||"",quantity:e.quantity||0,price:e.price||0,total:e.total||0})),subtotal:d.subtotal||0,total:d.total||0,shippingProvider:d.shippingProvider,trackingNumber:d.trackingNumber})}catch(e){console.error("Failed to send shipping email:",e)}return a.NextResponse.json({success:!0,order:d})}catch(e){return console.error("Error updating order:",e),a.NextResponse.json({error:"Failed to update order"},{status:500})}}let x=new i.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/orders/[id]/route",pathname:"/api/orders/[id]",filename:"route",bundlePath:"app/api/orders/[id]/route"},resolvedPagePath:"C:\\Users\\ADMIN\\OneDrive\\Documents\\PERSONAL\\DEVELOPMENTS\\LKM\\web\\src\\app\\api\\orders\\[id]\\route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:g,workUnitAsyncStorage:b,serverHooks:h}=x;function f(){return(0,d.patchFetch)({workAsyncStorage:g,workUnitAsyncStorage:b})}},96487:()=>{},78335:()=>{},47811:(e,r,t)=>{"use strict";t.d(r,{m:()=>i,r:()=>s});var o=t(98721);async function i(e){let r=o.createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),t=e.items.map(e=>`
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${e.productName}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${e.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${Number(e.price).toFixed(2)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${Number(e.total).toFixed(2)}</td>
            </tr>
        `).join(""),i=`
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
                    ${t}
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
    `;try{return await r.sendMail({from:`"Lakemba Mobile King" <${process.env.EMAIL_USER}>`,to:e.customerEmail,subject:`Order Confirmation - ${e.orderNumber}`,html:i}),console.log("Order confirmation email sent to:",e.customerEmail),!0}catch(e){return console.error("Failed to send order confirmation email:",e),!1}}async function s(e){let r=o.createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),t={aus_post:"Australia Post",sendle:"Sendle",startrack:"StarTrack",dhl:"DHL Express",other:"Our Carrier"}[e.shippingProvider||"other"]||"Our Carrier",i=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 25px 0; background: #1e40af; color: white; border-radius: 12px 12px 0 0;">
            <div style="font-size: 40px; margin-bottom: 10px;">🚚</div>
            <h1 style="margin: 0; font-size: 24px;">Your order is on its way!</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Great news! Your package has been shipped.</p>
        </div>

        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px;">Hi ${e.customerName},</p>
            <p style="color: #4b5563; line-height: 1.6;">Good news! We've dispatched your order <strong>${e.orderNumber}</strong>. It's now being handled by <strong>${t}</strong>.</p>

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
                    <p style="margin: 0; font-weight: bold; color: #1e293b;">${t}</p>
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
    `;try{return await r.sendMail({from:`"Lakemba Mobile King" <${process.env.EMAIL_USER}>`,to:e.customerEmail,subject:`Shipping Confirmation - Your order ${e.orderNumber} is on its way!`,html:i}),console.log("Shipped confirmation email sent to:",e.customerEmail),!0}catch(e){return console.error("Failed to send shipped confirmation email:",e),!1}}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[638,5352,5452,8721,3887],()=>t(79415));module.exports=o})();