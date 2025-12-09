"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
block_basekit_server_api_1.basekit.addDomainList([...feishuDm, 'api.exchangerate-api.com', 'ai-box.xyb2b.com']);
const XY_OSS = "https://ai-box.xyb2b.com/ai-plugin-box/execute/oss-opt";
block_basekit_server_api_1.basekit.addField({
    // 定义捷径的i18n语言资源
    /*i18n: {
      messages: {
        'zh-CN': {
          'rmb': '人民币金额',
          'usd': '美元金额',
          'rate': '汇率',
        },
        'en-US': {
          'rmb': 'RMB Amount',
          'usd': 'Dollar amount',
          'rate': 'Exchange Rate',
        },
        'ja-JP': {
          'rmb': '人民元の金額',
          'usd': 'ドル金額',
          'rate': '為替レート',
        },
      }
    },*/
    // 定义捷径的入参
    formItems: [
        {
            key: 'input',
            label: '输入信息',
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                mode: 'multiple',
                supportType: block_basekit_server_api_1.FieldType.Text,
            },
            validator: {
                required: true,
            },
        },
        {
            key: 'PDF',
            label: 'PDF表格',
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                mode: 'single',
                supportType: [
                    block_basekit_server_api_1.FieldType.Attachment
                ],
            },
            validator: {
                required: false
            }
        },
    ],
    // 定义捷径的返回结果类型
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            properties: [
                {
                    key: 'input',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: '输入信息',
                },
            ],
        },
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams /*: { account: number }*/, context) => {
        //const { account = 0 } = formItemParams;
        const { input = [], PDF } = formItemParams;
        /**
             * 为方便查看日志，使用此方法替代console.log
             * 开发者可以直接使用这个工具函数进行日志记录
             */
        function debugLog(arg, showContext = false) {
            // @ts-ignore
            if (!showContext) {
                console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
                return;
            }
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg
            }), '\n');
        }
        // 入口第一行日志，展示formItemParams和context，方便调试
        // 每次修改版本时，都需要修改日志版本号，方便定位问题
        debugLog('=====start=====v1', true);
        /**
         * 封装好的fetch函数 - 开发者请尽量使用这个封装，而不是直接调用context.fetch
         * 这个封装会自动处理日志记录和错误捕获，简化开发工作
         */
        const fetch = async (url, init, authId) => {
            try {
                const res = await context.fetch(url, init, authId);
                // 不要直接.json()，因为接口返回的可能不是json格式，会导致解析错误
                const resText = await res.text();
                console.log('====resText', input);
                // 自动记录请求结果日志
                debugLog({
                    [`===fetch res： ${url} 接口返回结果`]: {
                        url,
                        init,
                        authId,
                        resText: resText.slice(0, 4000), // 截取部分日志避免日志量过大
                    }
                });
                return JSON.parse(resText);
            }
            catch (e) {
                // 自动记录错误日志
                debugLog({
                    [`===fetch error： ${url} 接口返回错误`]: {
                        url,
                        init,
                        authId,
                        error: e
                    }
                });
                return {
                    code: -1,
                    error: e
                };
            }
        };
        try {
            /*
            interface ExchangeRateResponse {
              rates: {
                [currency: string]: number
              }
            }
            /*
            const res = await fetch<ExchangeRateResponse>('https://api.exchangerate-api.com/v4/latest/CNY2', { // 已经在addDomainList中添加为白名单的请求
              method: 'GET',
            });
      
            const usdRate = res?.rates?.['USD'];*/
            /*
            const oss_res = await fetch<any>(XY_OSS, {
              method: 'POST',
              headers: {
                'authorization': 'ZHExG7au)qmUv^nKJ8#ob3f2KgJYA)i+',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "operation":"PUT",
                "ossPath": "pdf_to_markdown",
                "expireMinute": -1,
                "attachmentDisposition": false,
                "file": "${PDF}"
              })
            });
      
            const oss_path = oss_res?.data?.url;
      */
            const inputStr = input[0];
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    'input': input,
                },
            };
            /*
              如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
      
            return {
              code: FieldCode.Success,
              data: {
                id: `具体错误原因`,
                usd: 0,
                rate: 0,
              }
            }
      
            */
        }
        catch (e) {
            console.log('====error', String(e));
            debugLog({
                '===999 异常错误': String(e)
            });
            /** 返回非 Success 的错误码，将会在单元格上显示报错，请勿返回msg、message之类的字段，它们并不会起作用。
             * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因。
             */
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBbUs7QUFDbkssTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLHFEQUFxRDtBQUNyRCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLDBCQUEwQixFQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztBQUNwRixNQUFNLE1BQU0sR0FBRyx3REFBd0QsQ0FBQTtBQUV2RSxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLGdCQUFnQjtJQUNoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0JJO0lBQ0osVUFBVTtJQUNWLFNBQVMsRUFBRTtRQUNUO1lBQ0UsR0FBRyxFQUFFLE9BQU87WUFDWixLQUFLLEVBQUUsTUFBTTtZQUNiLFNBQVMsRUFBRSx5Q0FBYyxDQUFDLFdBQVc7WUFDckMsS0FBSyxFQUFDO2dCQUVKLElBQUksRUFBRSxVQUFVO2dCQUNoQixXQUFXLEVBQUUsb0NBQVMsQ0FBQyxJQUFJO2FBRTVCO1lBQ0QsU0FBUyxFQUFDO2dCQUNSLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtRQUNEO1lBQ0UsR0FBRyxFQUFFLEtBQUs7WUFDVixLQUFLLEVBQUUsT0FBTztZQUNkLFNBQVMsRUFBQyx5Q0FBYyxDQUFDLFdBQVc7WUFDcEMsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxRQUFRO2dCQUNkLFdBQVcsRUFBRTtvQkFDWCxvQ0FBUyxDQUFDLFVBQVU7aUJBQ3JCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFDLEtBQUs7YUFFZjtTQUNGO0tBQ0Y7SUFDRCxjQUFjO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsSUFB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