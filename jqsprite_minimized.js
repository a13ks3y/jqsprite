(function(q,d){var l=function(b,a){var b=d(b),f=b.data("sprite"),c;c=d.extend(null,p,f,a);b.data("sprite",c);b.css({width:c.width,height:c.height,backgroundImage:"url("+c.sprite.image+")",backgroundPosition:-c.x+"px "+-c.y+"px",backgroundRepeat:"no"});a.animation&&i(b,c,c.animation);if(!c.initialized||!c.nobind)b.bind("pause",function(){g(b,b.data("sprite"))}),b.bind("stop",function(){j(b,b.data("sprite"))}),b.bind("play",function(){k(b,b.data("sprite"))}),b.bind("set",function(a,c){l(b,c)}),b.bind("render",
    function(a,f){d.extend(c,f);m(b,c)}),b.bind("animation",function(a,d){i(b,c,d)}),b.bind("destroy",function(a,d){n(b,c,d)});c.paused||k(b,c);c.initialized=!0},n=function(b,a,f){b=d(b);j(b,a);b.data("sprite",null);f?b.detach():(b.css({backgroundImage:"none",backgroundPosition:"0px 0px"}),b.removeClass("sprite"))},i=function(b,a,d){var d=a.sprite.animations[d],c;d&&(c=a.sprite.framesets[d.frameset],a.animation=d.frames,a.animationLastIndex=a.animation.length,a.frame=0,a.width=c.width,a.height=c.height,
    h(b,a))},m=function(b,a){console.log(a);d(b).css({width:a.width,height:a.height,backgroundPosition:-a.x+"px "+-a.y+"px"})},h=function(b,a){a.animation&&(b=d(b),a.x=a.animation[a.frame]*a.width,b.css({width:a.width,height:a.height,backgroundPosition:-a.x+"px "+-a.y+"px"}))},o=function(b,a){a.animation&&a.animationLastIndex&&(b=d(b),0===a.frame&&b.trigger("begun"),a.frame++,a.frame>=a.animationLastIndex?(a.loop?(a.frame=0,b.trigger("begun")):g(b,a),b.trigger("finished")):(h(b,a),b.trigger("nextFrame",
    a.frame)),a.intervalId=setTimeout(function(){o(b,a)},a.speed))},k=function(b,a){g(b,a);a.speed=Math.floor(1E3/a.fps);a.intervalId=setTimeout(function(){o(b,a)},a.speed);d(b).trigger("started",a.frame)},g=function(b,a){clearTimeout(a.intervalId);d(b).trigger("paused")},j=function(b,a){clearTimeout(a.intervalId);a.frame=0;h(b,a);d(b).trigger("stopped",a.frame)},p={image:null,animation:null,x:0,y:0,width:0,height:0,intervalId:null,frame:0,animationLastIndex:null,fps:12,paused:!0,loop:!1,initialized:!1};
    d.fn.sprite=function(b,a){this.each(function(f,c){if("string"===typeof b){var e=d(c).data("sprite");if(e.initialized)switch(b){case "animation":i(c,e,a);break;case "play":k(c,e);break;case "pause":g(c,e);break;case "stop":j(c,e);break;case "render":m(c,e);break;case "frame":e.frame="number"===typeof a?a:e.frame;h(c,e);break;case "destroy":n(c,e,a)}}else l(c,b)});return this}})(window,window.jQuery);