import SparkMD5 from 'spark-md5';

export default [
    () => Array.from(document.querySelectorAll('meta')).map(
        domNode => [
            domNode.getAttribute('property') ?? domNode.getAttribute('name') ?? domNode.getAttribute('itemprop'),
            domNode.getAttribute('content') 
        ]
    ),
    () => Array.from(document.querySelectorAll<HTMLElement>('[type^="application/ld+json"]'))
            .map(node=>JSON.parse(node.innerText))
            .reduce((pre, cur)=> {
                if (Array.isArray(cur)) {
                    cur.forEach(c=> pre = pre.concat(c))
                } else {
                    pre = pre.concat(cur)
                }
                return pre;
            }, [])
            .map(item=>Object.entries(item))
            .reduce((pre, cur) => pre.concat(cur)
    ),
    () => Array.from(document.querySelectorAll<HTMLElement>('[data-eec-productdetails]'))
            .map(node=>Object.entries(JSON.parse(node.dataset.eecProductdetails as string)))
            .reduce((pre, cur) => pre.concat(cur)
    ),
    () => {
        const dt = Array.from(document.querySelectorAll<HTMLElement>('dl > dt')).map(node=>node.textContent?.trim());
        const dd = Array.from(document.querySelectorAll<HTMLElement>('dl > dd')).map(node=>node.textContent?.trim());
        return dd.map((value, i) => [dt[i], value]);
    },
    () => Array.from(document.querySelectorAll<HTMLElement>('table')).reduce((result, table) => {
        const ths = Array.from(table.querySelectorAll<HTMLElement>('tr > th')).map(node=>node.textContent?.trim());
        const tds = Array.from(table.querySelectorAll<HTMLElement>('tr > td')).map(node=>node.textContent?.trim());
        ths.forEach((th,i) => result.push([th, tds[i]]))
        return result;
    }, []),
    () => Object.entries(typeof(tc_vars) == "object" ? tc_vars:{}),
    (current) => {
        const entries = Object.fromEntries(current.flat());
        if (typeof(entries.price) != "undefined" && typeof(entries.currency) != "undefined" ) {
            return [];
        }
        if (typeof(entries.offers) != "undefined" && typeof(entries.offers.offers) != "undefined"&& typeof(entries.offers.offers[0]) != "undefined") {

            return [
                [
                    "price",
                    entries.offers.offers[0].price
                ],
                [
                    "currency",
                    entries.offers.offers[0].priceCurrency
                ]];
            }
        if (typeof(entries.offers) != "undefined" && typeof(entries.offers.price) != "undefined") {

            return [
                [
                    "price",
                    entries.offers.price
                ],[
                    "currency",
                    entries.offers.priceCurrency
                ]];
            }
        return [
        [
            "price",
            [
                '[data-qa-id="adview_price"]',//leboncoin
                '.buyBoxBlock .price',//rakuten
                '.details-list--pricing h1',//vinted
                '.a-price .a-offscreen',//amazonfr
                '.product-price-current',//ali
                '.product-price__price',//darty
                '.userPrice',//fnac
            ].map((selector) => {
                let price = document.querySelector(selector);
                if(price) {
                    price = price.textContent.trim()
                }
                if(price) {
                    price = price.trim()
                }
                if(typeof price === 'string' && price.match(/^\d+(,\d{1,2})?(\.\d{1,2})?/)) {
                    price = price.match(/^\d+(,\d{1,2})?(\.\d{1,2})?/)[0];
                    price = price.replace(',', '.');
                }
                return ~~Number(price)>0 ? +parseFloat(price).toFixed(2) : undefined;
                }).find(element => typeof element === 'number')
        ]
    ]},
    () => [
        [
            "images", 
            [].slice.call(document.images).map( (img) =>{
                img.area = img.naturalHeight*img.naturalWidth;
                return img;
            }).filter(img=>{
                return img.area>10000;
            }).sort((a, b)=>{
                return b.area - a.area;
            }).slice(
                0, 20
            ).map(img=>{
                return img.src;
            })
        ]
    ],
    () => Object.entries(typeof(tc_vars) == "object" ? tc_vars:{}),
    (current) => {
        const entries = Object.fromEntries(current.flat());
        
        if (typeof(entries.images) == "undefined") {
            entries.images = [];
        }
        if (typeof(entries['og:image']) != "undefined") {
            entries.images.unshift(entries['og:image']);
        }
        if (typeof(entries.image) != "undefined") {
            entries.images.unshift(entries.image);
        }
        return [["image", entries?.images.filter(function isValidHttpUrl(img: string) {
            try {
                new URL(img);
            } catch (_) {
                return false;  
            }
            
            return !img.match(/\.svg/);
            })[0]]];
    },
    () => [
        [
            "title",
            document.title
        ]
    ],
    () => [
        [
            "url",
            window.location.toString()
        ]
    ],
    () => [
        [
            "canonical",
            document.querySelector("link[rel='canonical']")?.getAttribute("href")
        ]
    ],
    () => [
        [
            "updatedAt",
            new Date()
        ]
    ],
    () => [
        [
            "favicon",
            () => {
                let favicon = undefined;
                const nodeList = document.getElementsByTagName("link");
                for (let i = 0; i < nodeList.length; i++)
                {
                    if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
                    {
                        favicon = nodeList[i].getAttribute("href");
                    }
                }
                return favicon;        
            }
        ]
    ],
    () => [
        [
            "id",
            SparkMD5.hash(window.location.toString())
        ]
    ],
];