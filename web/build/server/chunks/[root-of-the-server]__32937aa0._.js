module.exports=[193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},224361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},270406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},814747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},921517,(e,t,r)=>{t.exports=e.x("http",()=>require("http"))},524836,(e,t,r)=>{t.exports=e.x("https",()=>require("https"))},233405,(e,t,r)=>{t.exports=e.x("child_process",()=>require("child_process"))},522734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},782080,e=>{"use strict";var t=e.i(125679);async function r(e){let r=t.default.createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),o=e.items.map(e=>`
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${e.productName}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${e.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${Number(e.price).toFixed(2)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${Number(e.total).toFixed(2)}</td>
            </tr>
        `).join(""),a=`
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
                    ${o}
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
    `;try{return await r.sendMail({from:`"Lakemba Mobile King" <${process.env.EMAIL_USER}>`,to:e.customerEmail,subject:`Order Confirmation - ${e.orderNumber}`,html:a}),console.log("Order confirmation email sent to:",e.customerEmail),!0}catch(e){return console.error("Failed to send order confirmation email:",e),!1}}async function o(e){let r=t.default.createTransport({service:"gmail",auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}}),o={aus_post:"Australia Post",sendle:"Sendle",startrack:"StarTrack",dhl:"DHL Express",other:"Our Carrier"}[e.shippingProvider||"other"]||"Our Carrier",a=`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 25px 0; background: #1e40af; color: white; border-radius: 12px 12px 0 0;">
            <div style="font-size: 40px; margin-bottom: 10px;">🚚</div>
            <h1 style="margin: 0; font-size: 24px;">Your order is on its way!</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Great news! Your package has been shipped.</p>
        </div>

        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px;">Hi ${e.customerName},</p>
            <p style="color: #4b5563; line-height: 1.6;">Good news! We've dispatched your order <strong>${e.orderNumber}</strong>. It's now being handled by <strong>${o}</strong>.</p>

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
                    <p style="margin: 0; font-weight: bold; color: #1e293b;">${o}</p>
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
    `;try{return await r.sendMail({from:`"Lakemba Mobile King" <${process.env.EMAIL_USER}>`,to:e.customerEmail,subject:`Shipping Confirmation - Your order ${e.orderNumber} is on its way!`,html:a}),console.log("Shipped confirmation email sent to:",e.customerEmail),!0}catch(e){return console.error("Failed to send shipped confirmation email:",e),!1}}e.s(["sendOrderConfirmationEmail",()=>r,"sendShippedConfirmationEmail",()=>o])},796514,e=>{"use strict";var t=e.i(698490),r=e.i(618006),o=e.i(795912),a=e.i(772560),i=e.i(976852),s=e.i(738533),n=e.i(455822),d=e.i(754068),p=e.i(266843),l=e.i(699385),c=e.i(903050),u=e.i(475293),m=e.i(502144),g=e.i(833599),x=e.i(536497),b=e.i(193695);e.i(779178);var h=e.i(396717),f=e.i(23480),y=e.i(828007),v=e.i(115895),w=e.i(552692),k=e.i(245205),R=e.i(186776),E=e.i(782080);async function S(e){try{let t,r=await e.text(),o=e.headers.get("stripe-signature");if(!o)return f.NextResponse.json({error:"Missing stripe-signature header"},{status:400});let[a]=await v.db.select().from(w.settings).where((0,k.eq)(w.settings.key,"payment_settings")).limit(1);if(!a?.value)return f.NextResponse.json({error:"Payment settings not configured"},{status:500});let i=JSON.parse(a.value),s=i.stripe?.secretKey,n=i.stripe?.webhookSecret;if(!s||!n)return f.NextResponse.json({error:"Stripe credentials not configured"},{status:500});let d=new y.default(s,{apiVersion:"2025-12-15.clover"});try{t=d.webhooks.constructEvent(r,o,n)}catch(e){return console.error("Webhook signature verification failed:",e),f.NextResponse.json({error:"Invalid signature"},{status:400})}if("payment_intent.succeeded"===t.type){let e=t.data.object,r=e.metadata;if(r.tempReference&&!r.orderId){let t=r.tempReference,o=r.customerName||"Customer",a=r.customerEmail||"",i=r.customerPhone||"",s=r.customerAddress||"",n=parseFloat(r.total||"0"),d=parseFloat(r.subtotal||"0"),p=parseFloat(r.shipping||"0"),l=r.notes||"",c=[];try{c=JSON.parse(r.items||"[]")}catch(e){console.error("Failed to parse items from metadata:",e)}let u=(await v.db.insert(w.orders).values({orderNumber:t,customerName:o,customerEmail:a,customerPhone:i,shippingAddress:s,subtotal:d.toString(),shipping:p.toString(),total:n.toString(),status:"processing",paymentStatus:"paid",paymentMethod:"stripe",stripePaymentIntentId:e.id,notes:l,createdAt:new Date}))[0].insertId;for(let e of c)await v.db.insert(w.orderItems).values({orderId:u,productId:parseInt(e.id),productName:e.name,quantity:e.qty,price:String(e.price),total:String(e.price*e.qty)}),await v.db.update(w.products).set({stock:R.sql`${w.products.stock} - ${e.qty}`}).where((0,k.eq)(w.products.id,parseInt(e.id)));try{let[e]=await v.db.select().from(w.customers).where((0,k.eq)(w.customers.email,a)).limit(1);e?await v.db.update(w.customers).set({totalOrders:R.sql`${w.customers.totalOrders} + 1`,totalSpent:R.sql`${w.customers.totalSpent} + ${n}`,lastOrderDate:new Date,phone:i||e.phone,address:s||e.address}).where((0,k.eq)(w.customers.id,e.id)):await v.db.insert(w.customers).values({email:a,name:o,phone:i||null,address:s||null,totalOrders:1,totalSpent:n.toString(),lastOrderDate:new Date,source:"website"})}catch(e){console.error("Failed to update customer record in webhook:",e)}console.log(`Order ${t} created after successful Stripe payment`);try{await (0,E.sendOrderConfirmationEmail)({orderNumber:t,customerName:o,customerEmail:a,customerPhone:i,shippingAddress:s,items:c.map(e=>({productName:e.name,quantity:e.qty,price:e.price,total:e.price*e.qty})),subtotal:d,total:n,paymentMethod:"stripe"})}catch(e){console.error("Failed to send confirmation email:",e)}}else r.orderId&&(await v.db.update(w.orders).set({paymentStatus:"paid",status:"processing",paymentMethod:"stripe",stripePaymentIntentId:e.id}).where((0,k.eq)(w.orders.id,parseInt(r.orderId))),console.log(`Order ${r.orderId} marked as paid via Stripe webhook`))}if("payment_intent.payment_failed"===t.type){let e=t.data.object,r=e.metadata?.orderId;r&&(await v.db.update(w.orders).set({paymentStatus:"failed"}).where((0,k.eq)(w.orders.id,parseInt(r))),console.log(`Order ${r} payment failed`))}return f.NextResponse.json({received:!0})}catch(e){return console.error("Webhook error:",e),f.NextResponse.json({error:"Webhook handler failed"},{status:500})}}e.s(["POST",()=>S,"runtime",0,"nodejs"],921970);var N=e.i(921970);let A=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/webhooks/stripe/route",pathname:"/api/webhooks/stripe",filename:"route",bundlePath:""},distDir:"build",relativeProjectDir:"",resolvedPagePath:"[project]/web/src/app/api/webhooks/stripe/route.ts",nextConfigOutput:"standalone",userland:N}),{workAsyncStorage:$,workUnitAsyncStorage:C,serverHooks:q}=A;function I(){return(0,o.patchFetch)({workAsyncStorage:$,workUnitAsyncStorage:C})}async function O(e,t,o){A.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/api/webhooks/stripe/route";f=f.replace(/\/index$/,"")||"/";let y=await A.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:v,params:w,nextConfig:k,parsedUrl:R,isDraftMode:E,prerenderManifest:S,routerServerContext:N,isOnDemandRevalidate:$,revalidateOnlyGenerated:C,resolvedPathname:q,clientReferenceManifest:I,serverActionsManifest:O}=y,P=(0,n.normalizeAppPath)(f),_=!!(S.dynamicRoutes[P]||S.routes[q]),T=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,R,!1):t.end("This page could not be found"),null);if(_&&!E){let e=!!S.routes[q],t=S.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(k.experimental.adapterPath)return await T();throw new b.NoFallbackError}}let M=null;!_||A.isDev||E||(M="/index"===(M=q)?"/":M);let j=!0===A.isDev||!_,D=_&&!j;O&&I&&(0,s.setManifestsSingleton)({page:f,clientReferenceManifest:I,serverActionsManifest:O});let L=e.method||"GET",U=(0,i.getTracer)(),H=U.getActiveScopeSpan(),F={params:w,prerenderManifest:S,renderOpts:{experimental:{authInterrupts:!!k.experimental.authInterrupts},cacheComponents:!!k.cacheComponents,supportsDynamicResponse:j,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:k.cacheLife,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,o,a)=>A.onRequestError(e,t,o,a,N)},sharedContext:{buildId:v}},z=new d.NodeNextRequest(e),K=new d.NodeNextResponse(t),B=p.NextRequestAdapter.fromNodeNextRequest(z,(0,p.signalFromNodeResponse)(t));try{let s=async e=>A.handle(B,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=U.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let o=r.get("next.route");if(o){let t=`${L} ${o}`;e.setAttributes({"next.route":o,"http.route":o,"next.span_name":t}),e.updateName(t)}else e.updateName(`${L} ${f}`)}),n=!!(0,a.getRequestMeta)(e,"minimalMode"),d=async a=>{var i,d;let p=async({previousCacheEntry:r})=>{try{if(!n&&$&&C&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await s(a);e.fetchMetrics=F.renderOpts.fetchMetrics;let d=F.renderOpts.pendingWaitUntil;d&&o.waitUntil&&(o.waitUntil(d),d=void 0);let p=F.renderOpts.collectedTags;if(!_)return await (0,u.sendResponse)(z,K,i,F.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(i.headers);p&&(t[x.NEXT_CACHE_TAGS_HEADER]=p),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,o=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:o}}}}catch(t){throw(null==r?void 0:r.isStale)&&await A.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:$})},!1,N),t}},l=await A.handleResponse({req:e,nextConfig:k,cacheKey:M,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:$,revalidateOnlyGenerated:C,responseGenerator:p,waitUntil:o.waitUntil,isMinimalMode:n});if(!_)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(d=l.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});n||t.setHeader("x-nextjs-cache",$?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let b=(0,m.fromNodeOutgoingHttpHeaders)(l.value.headers);return n&&_||b.delete(x.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||b.get("Cache-Control")||b.set("Cache-Control",(0,g.getCacheControlHeader)(l.cacheControl)),await (0,u.sendResponse)(z,K,new Response(l.value.body,{headers:b,status:l.value.status||200})),null};H?await d(H):await U.withPropagatedContext(e.headers,()=>U.trace(l.BaseServerSpan.handleRequest,{spanName:`${L} ${f}`,kind:i.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},d))}catch(t){if(t instanceof b.NoFallbackError||await A.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:$})},!1,N),_)throw t;return await (0,u.sendResponse)(z,K,new Response(null,{status:500})),null}}e.s(["handler",()=>O,"patchFetch",()=>I,"routeModule",()=>A,"serverHooks",()=>q,"workAsyncStorage",()=>$,"workUnitAsyncStorage",()=>C],796514)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__32937aa0._.js.map