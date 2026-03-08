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
    `;try{return await r.sendMail({from:`"Lakemba Mobile King" <${process.env.EMAIL_USER}>`,to:e.customerEmail,subject:`Shipping Confirmation - Your order ${e.orderNumber} is on its way!`,html:a}),console.log("Shipped confirmation email sent to:",e.customerEmail),!0}catch(e){return console.error("Failed to send shipped confirmation email:",e),!1}}e.s(["sendOrderConfirmationEmail",()=>r,"sendShippedConfirmationEmail",()=>o])},635033,e=>{"use strict";var t=e.i(698490),r=e.i(618006),o=e.i(795912),a=e.i(772560),s=e.i(976852),i=e.i(738533),n=e.i(455822),d=e.i(754068),l=e.i(266843),p=e.i(699385),c=e.i(903050),u=e.i(475293),m=e.i(502144),x=e.i(833599),g=e.i(536497),h=e.i(193695);e.i(779178);var b=e.i(396717),f=e.i(23480),y=e.i(115895),v=e.i(552692),w=e.i(245205),R=e.i(470183),E=e.i(186776),k=e.i(782080);async function N(e){try{let t,{searchParams:r}=new URL(e.url),o=r.get("search"),a=r.get("status"),s=r.get("paymentStatus"),i=r.get("sort")||"desc";y.db.select().from(v.orders);let n=[];return o&&n.push((0,w.or)((0,w.like)(v.orders.orderNumber,`%${o}%`),(0,w.like)(v.orders.customerName,`%${o}%`),(0,w.like)(v.orders.customerEmail,`%${o}%`))),a&&"all"!==a&&n.push((0,w.eq)(v.orders.status,a)),s&&"all"!==s&&n.push((0,w.eq)(v.orders.paymentStatus,s)),t=n.length>0?await y.db.select().from(v.orders).where((0,w.and)(...n)).orderBy("asc"===i?(0,R.asc)(v.orders.createdAt):(0,R.desc)(v.orders.createdAt)):await y.db.select().from(v.orders).orderBy("asc"===i?(0,R.asc)(v.orders.createdAt):(0,R.desc)(v.orders.createdAt)),f.NextResponse.json(t)}catch(e){return console.error("Error fetching orders:",e),f.NextResponse.json({error:"Failed to fetch orders"},{status:500})}}async function A(e){try{let{customer:t,items:r,total:o,paymentMethod:a}=await e.json();if(!t||!r||!r.length)return f.NextResponse.json({error:"Invalid order data"},{status:400});for(let e of r){let[t]=await y.db.select({stock:v.products.stock}).from(v.products).where((0,w.eq)(v.products.id,parseInt(e.id))).limit(1);if(!t)return f.NextResponse.json({error:`Product not found: ${e.name}`},{status:400});let r=t.stock||0;if(r<e.quantity)return f.NextResponse.json({error:`Insufficient stock for ${e.name}. Available: ${r}`},{status:400})}let s=`LKM-${Date.now()}-${Math.floor(1e3*Math.random())}`,i=(await y.db.insert(v.orders).values({orderNumber:s,customerName:t.name,customerEmail:t.email,customerPhone:t.phone,shippingAddress:t.address,subtotal:o,total:o,status:"pending",paymentStatus:"unpaid",paymentMethod:a||null,createdAt:new Date}))[0].insertId,n=[];for(let e of r)n.push({orderId:i,productId:parseInt(e.id),productName:e.name,quantity:e.quantity,price:String(e.price),total:String(e.price*e.quantity)}),await y.db.update(v.products).set({stock:E.sql`${v.products.stock} - ${e.quantity}`}).where((0,w.eq)(v.products.id,parseInt(e.id)));await y.db.insert(v.orderItems).values(n);try{let[e]=await y.db.select().from(v.customers).where((0,w.eq)(v.customers.email,t.email)).limit(1);e?await y.db.update(v.customers).set({totalOrders:E.sql`${v.customers.totalOrders} + 1`,totalSpent:E.sql`${v.customers.totalSpent} + ${o}`,lastOrderDate:new Date,phone:t.phone||e.phone,address:t.address||e.address}).where((0,w.eq)(v.customers.id,e.id)):await y.db.insert(v.customers).values({email:t.email,name:t.name,phone:t.phone||null,address:t.address||null,totalOrders:1,totalSpent:o.toString(),lastOrderDate:new Date,source:"website"})}catch(e){console.error("Failed to update customer record:",e)}try{await (0,k.sendOrderConfirmationEmail)({orderNumber:s,customerName:t.name,customerEmail:t.email,customerPhone:t.phone,shippingAddress:t.address,items:r.map(e=>({productName:e.name,quantity:e.quantity,price:e.price,total:e.price*e.quantity})),subtotal:o,total:o,paymentMethod:a})}catch(e){console.error("Failed to send confirmation email:",e)}return f.NextResponse.json({success:!0,orderNumber:s,orderId:i},{status:201})}catch(e){return console.error("Order creation failed:",e),f.NextResponse.json({error:"Failed to create order",details:e},{status:500})}}e.s(["GET",()=>N,"POST",()=>A],367921);var $=e.i(367921);let S=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/orders/route",pathname:"/api/orders",filename:"route",bundlePath:""},distDir:"build",relativeProjectDir:"",resolvedPagePath:"[project]/web/src/app/api/orders/route.ts",nextConfigOutput:"standalone",userland:$}),{workAsyncStorage:C,workUnitAsyncStorage:q,serverHooks:P}=S;function O(){return(0,o.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:q})}async function T(e,t,o){S.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/api/orders/route";f=f.replace(/\/index$/,"")||"/";let y=await S.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:v,params:w,nextConfig:R,parsedUrl:E,isDraftMode:k,prerenderManifest:N,routerServerContext:A,isOnDemandRevalidate:$,revalidateOnlyGenerated:C,resolvedPathname:q,clientReferenceManifest:P,serverActionsManifest:O}=y,T=(0,n.normalizeAppPath)(f),I=!!(N.dynamicRoutes[T]||N.routes[q]),_=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,E,!1):t.end("This page could not be found"),null);if(I&&!k){let e=!!N.routes[q],t=N.dynamicRoutes[T];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await _();throw new h.NoFallbackError}}let M=null;!I||S.isDev||k||(M="/index"===(M=q)?"/":M);let j=!0===S.isDev||!I,D=I&&!j;O&&P&&(0,i.setManifestsSingleton)({page:f,clientReferenceManifest:P,serverActionsManifest:O});let L=e.method||"GET",U=(0,s.getTracer)(),H=U.getActiveScopeSpan(),F={params:w,prerenderManifest:N,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:j,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,o,a)=>S.onRequestError(e,t,o,a,A)},sharedContext:{buildId:v}},z=new d.NodeNextRequest(e),K=new d.NodeNextResponse(t),B=l.NextRequestAdapter.fromNodeNextRequest(z,(0,l.signalFromNodeResponse)(t));try{let i=async e=>S.handle(B,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=U.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let o=r.get("next.route");if(o){let t=`${L} ${o}`;e.setAttributes({"next.route":o,"http.route":o,"next.span_name":t}),e.updateName(t)}else e.updateName(`${L} ${f}`)}),n=!!(0,a.getRequestMeta)(e,"minimalMode"),d=async a=>{var s,d;let l=async({previousCacheEntry:r})=>{try{if(!n&&$&&C&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(a);e.fetchMetrics=F.renderOpts.fetchMetrics;let d=F.renderOpts.pendingWaitUntil;d&&o.waitUntil&&(o.waitUntil(d),d=void 0);let l=F.renderOpts.collectedTags;if(!I)return await (0,u.sendResponse)(z,K,s,F.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,o=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:o}}}}catch(t){throw(null==r?void 0:r.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:$})},!1,A),t}},p=await S.handleResponse({req:e,nextConfig:R,cacheKey:M,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:$,revalidateOnlyGenerated:C,responseGenerator:l,waitUntil:o.waitUntil,isMinimalMode:n});if(!I)return null;if((null==p||null==(s=p.value)?void 0:s.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(d=p.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});n||t.setHeader("x-nextjs-cache",$?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),k&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let h=(0,m.fromNodeOutgoingHttpHeaders)(p.value.headers);return n&&I||h.delete(g.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||h.get("Cache-Control")||h.set("Cache-Control",(0,x.getCacheControlHeader)(p.cacheControl)),await (0,u.sendResponse)(z,K,new Response(p.value.body,{headers:h,status:p.value.status||200})),null};H?await d(H):await U.withPropagatedContext(e.headers,()=>U.trace(p.BaseServerSpan.handleRequest,{spanName:`${L} ${f}`,kind:s.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},d))}catch(t){if(t instanceof h.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:T,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:$})},!1,A),I)throw t;return await (0,u.sendResponse)(z,K,new Response(null,{status:500})),null}}e.s(["handler",()=>T,"patchFetch",()=>O,"routeModule",()=>S,"serverHooks",()=>P,"workAsyncStorage",()=>C,"workUnitAsyncStorage",()=>q],635033)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__5b4abcbc._.js.map