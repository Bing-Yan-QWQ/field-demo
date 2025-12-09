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
        type: block_basekit_server_api_1.FieldType.Text,
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
                data: inputStr,
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