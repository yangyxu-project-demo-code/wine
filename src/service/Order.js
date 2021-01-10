zn.define(function () {

    return zn.Class({
        methods: {
            doUserNotify: function (order, couriers){
                zn.wx.accessTokenRequest('template.send', {
                    touser: order.userOpenId,
                    template_id: "2z-H2qpu4zDdolLvDl3whOcReCrGprry-2t0NhcNqnw",
                    url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$user&role=user',
                    topcolor: "#FF0000",
                    data: {
                        first: {
                            value: "恭喜你购买成功！",
                            color: "#173177"
                        },
                        orderMoneySum: {
                            value: ((order.price||0).toFixed(2)) + "元(人民币)",
                            color: "#173177"
                        },
                        orderProductName: {
                            value: order.productTotalCount + "件商品",
                            color: "#173177"
                        },
                        Remark: {
                            value: "我们正在紧急派送中，请耐心等待！",
                            color: "#173177"
                        }
                    }
                }).then(function (data){
                    return zn.wx.accessTokenRequest('template.send', {
                        touser: order.merchantOpenId,
                        template_id: "HzWVDxagi6TGHl0CrJoZWECAdkISBJnwx8ysgZG-M38",
                        url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$merchant&role=merchant',
                        topcolor: "#FF0000",
                        data: {
                            first: {
                                value: "您好，您有新的购买订单。",
                                color: "#173177"
                            },
                            keyword1: {
                                value: order.orderCode,
                                color: "#173177"
                            },
                            keyword2: {
                                value: order.price.toFixed(2) + '元',
                                color: "#173177"
                            },
                            keyword3: {
                                value: order.createTime,
                                color: "#173177"
                            },
                            keyword4: {
                                value: order.addressName + ' / ' +order.addressPhone,
                                color: "#173177"
                            },
                            keyword5: {
                                value: order.province_convert + order.city_convert + order.area_convert + order.addressValue,
                                color: "#173177"
                            },
                            remark: {
                                value: '备注：' + order.note,
                                color: "#173177"
                            }
                        }
                    });
                }).then(function (){
                    if(!order.restaurantOpenId){
                        return -1;
                    }
                    return zn.wx.accessTokenRequest('template.send', {
                        touser: order.restaurantOpenId,
                        template_id: "z3wUQud1Ej93CzHm7px0qT1heQbU5l-k-Hcc5KxeM6E",
                        url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$restaurant&role=restaurant',
                        topcolor: "#FF0000",
                        data: {
                            first: {
                                value: "您好，客户已成功购买您代理商品。",
                                color: "#173177"
                            },
                            keyword1: {
                                value: "订单编号 " + order.orderCode,
                                color: "#173177"
                            },
                            keyword2: {
                                value: "10%开瓶费 "+order.restaurantPrice.toFixed(2) + '元',
                                color: "#173177"
                            },
                            keyword3: {
                                value: order.createTime,
                                color: "#173177"
                            },
                            remark: {
                                value: '备注：消费者确认收货既可提现。',
                                color: "#173177"
                            }
                        }
                    });
                }).then(function (){
                    couriers.forEach(function (courier, index){
                        zn.wx.accessTokenRequest('template.send', {
                            touser: courier.openId,
                            template_id: "HzWVDxagi6TGHl0CrJoZWECAdkISBJnwx8ysgZG-M38",
                            url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$courier&role=courier',
                            topcolor: "#FF0000",
                            data: {
                                first: {
                                    value: "您好，您有新的派送订单。",
                                    color: "#173177"
                                },
                                keyword1: {
                                    value: order.orderCode,
                                    color: "#173177"
                                },
                                keyword2: {
                                    value: order.price.toFixed(2) + '元',
                                    color: "#173177"
                                },
                                keyword3: {
                                    value: order.createTime,
                                    color: "#173177"
                                },
                                keyword4: {
                                    value: order.addressName + ' / ' +order.addressPhone,
                                    color: "#173177"
                                },
                                keyword5: {
                                    value: order.province_convert + order.city_convert + order.area_convert + order.addressValue,
                                    color: "#173177"
                                },
                                remark: {
                                    value: '备注：' + order.note,
                                    color: "#173177"
                                }
                            }
                        });
                    });
                });
            },
            doVieOrder: function (order){
                zn.wx.accessTokenRequest('template.send', {
                    touser: order.userOpenId,
                    template_id: "slOJpndhkoaL2v55pSdp5kjyBkVDiMbkIXD4wbrFjyk",
                    url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$user&role=user',
                    topcolor: "#FF0000",
                    data: {
                        first: {
                            value: "您的订单状态更新",
                            color: "#173177"
                        },
                        OrderSn: {
                            value: order.orderCode,
                            color: "#173177"
                        },
                        OrderStatus: {
                            value: '派送中...',
                            color: "#173177"
                        },
                        remark: {
                            value: "订单已经在派送中, 请耐心等待。",
                            color: "#173177"
                        }
                    }
                }).then(function (data){
                    return zn.wx.accessTokenRequest('template.send', {
                        touser: order.merchantOpenId,
                        template_id: "slOJpndhkoaL2v55pSdp5kjyBkVDiMbkIXD4wbrFjyk",
                        url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$merchant&role=merchant',
                        topcolor: "#FF0000",
                        data: {
                            first: {
                                value: "您好，您的订单已接单。",
                                color: "#173177"
                            },
                            OrderSn: {
                                value: order.orderCode,
                                color: "#173177"
                            },
                            OrderStatus: {
                                value: '已接单',
                                color: "#173177"
                            },
                            remark: {
                                value: '点击链接查看订单详情',
                                color: "#173177"
                            }
                        }
                    });
                });
            },
            doSignOrder: function (order){
                zn.wx.accessTokenRequest('template.send', {
                    touser: order.userOpenId,
                    template_id: "slOJpndhkoaL2v55pSdp5kjyBkVDiMbkIXD4wbrFjyk",
                    url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$user&role=user',
                    topcolor: "#FF0000",
                    data: {
                        first: {
                            value: "您的订单状态更新",
                            color: "#173177"
                        },
                        OrderSn: {
                            value: order.orderCode,
                            color: "#173177"
                        },
                        OrderStatus: {
                            value: '已签收',
                            color: "#173177"
                        },
                        remark: {
                            value: "谢谢您购买，您的订单已经签收。",
                            color: "#173177"
                        }
                    }
                }).then(function (data){
                    return zn.wx.accessTokenRequest('template.send', {
                        touser: order.merchantOpenId,
                        template_id: "slOJpndhkoaL2v55pSdp5kjyBkVDiMbkIXD4wbrFjyk",
                        url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$merchant&role=merchant',
                        topcolor: "#FF0000",
                        data: {
                            first: {
                                value: "您好，您的订单已签收。",
                                color: "#173177"
                            },
                            OrderSn: {
                                value: order.orderCode,
                                color: "#173177"
                            },
                            OrderStatus: {
                                value: '已签收',
                                color: "#173177"
                            },
                            remark: {
                                value: '点击链接查看订单详情',
                                color: "#173177"
                            }
                        }
                    });
                }).then(function (){
                    if(!order.restaurantOpenId){
                        return -1;
                    }
                    return zn.wx.accessTokenRequest('template.send', {
                        touser: order.restaurantOpenId,
                        template_id: "z3wUQud1Ej93CzHm7px0qT1heQbU5l-k-Hcc5KxeM6E",
                        url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$restaurant&role=restaurant',
                        topcolor: "#FF0000",
                        data: {
                            first: {
                                value: "已签收您代理商品, 开瓶费已入您账户中, 请查收。",
                                color: "#173177"
                            },
                            keyword1: {
                                value: "订单编号 " + order.orderCode,
                                color: "#173177"
                            },
                            keyword2: {
                                value: "10%开瓶费 "+order.restaurantPrice.toFixed(2) + '元',
                                color: "#173177"
                            },
                            keyword3: {
                                value: order.createTime,
                                color: "#173177"
                            },
                            remark: {
                                value: '备注：开瓶费已经进入您的账户并可提现。',
                                color: "#173177"
                            }
                        }
                    });
                });
            },
            doNotifyOrder: function (order){
                zn.wx.accessTokenRequest('template.send', {
                    touser: order.merchantOpenId,
                    template_id: "XE-uJbc9xF-EdEOYGb6g1cQYxyqMqWbBfNy2arj95mc",
                    url: 'http://wine.hu-chun.com/#/order/info?oc=' + order.orderCode+'$merchant&role=merchant',
                    topcolor: "#FF0000",
                    data: {
                        first: {
                            value: "提醒发货",
                            color: "#173177"
                        },
                        keyword1: {
                            value: order.orderCode,
                            color: "#173177"
                        },
                        keyword2: {
                            value: order.price+'元',
                            color: "#173177"
                        },
                        keyword3: {
                            value: order.price+'元',
                            color: "#173177"
                        },
                        keyword4: {
                            value: '已支付',
                            color: "#173177"
                        },
                        remark: {
                            value: "谢谢您购买，您的订单已经签收。",
                            color: "#173177"
                        }
                    }
                });
            }
        }
    });
});
