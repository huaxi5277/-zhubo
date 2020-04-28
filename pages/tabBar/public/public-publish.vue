<template>
	<view class="page">
		<view class="feedback-body">
			<textarea placeholder="请输入..." style="border-bottom:1px solid   #F1F1F3;" v-model="page" class="feedback-textare" />
			</view>
		<view class="feedback-body feedback-uploader">
		    <view class="uni-uploader">
		        <view class="uni-uploader-head" style="text-align: right;">
		            <view class=""></view>
		            <view class="uni-uploader-info">{{imageList.length}}/{{count}}</view>
		        </view>
		        <view class="uni-uploader-body">
		            <view class="uni-uploader__files" >
		                <block v-for="(image,index) in imageList" :key="index">
		                    <view class="uni-uploader__file" style="position: relative;">
		                        <image mode="aspectFill" class="uni-uploader__img" :src="image" @click="previewImage"></image>
		                        <view class="close-view" @click="deleteimg(index)">x</view>
		                    </view>
		                </block>
		                <view class="uni-uploader__input-box" v-show="imgList.length < count">
		                    <view class="uni-uploader__input" @tap="updateImage"></view>
		                </view>
		            </view>
		        </view>
		    </view>
		</view>
      


        <view class="swiper-list">
            <view class="uni-list-cell uni-list-cell-pd feedback-title">
                <view class="uni-list-cell-db ">图片是否压缩</view>
                <switch :checked="isYasuo" @change="changeIndicatorDots" />
            </view>
        </view>
    </view>
</template>

<script>
	import interfaces from '../../../utils/interfaces.js'
	import {
		pathToBase64,
		base64ToPath
	} from '../../../js_sdk/gsq-image-tools/image-tools/index.js'
    export default {
        name:'newsPublish',
        data() {
            return {
                isYasuo:true,
                count:6,
                maxwh:280,
                quality:1, 
                
                msgContents: ["界面显示错乱", "启动缓慢，卡出翔了", "UI无法直视，丑哭了", "偶发性崩溃"],
                stars: [1, 2, 3, 4, 5],
                imgList: [],
                sendDate: {
                    score: 0,
                    content: "",
                    contact: ""
                },
				page: "",
				imageList :[]
            }
        },
        onLoad() {

        },
        methods: {
			deleteimg(index){
				this.imageList.splice(index,1)
			},
			updateImage(){
							let _self = this
							if(this.imageList.length>=3){
								uni.showToast({
									icon:"none",
									"title" : "图片上传最多3"
								})
								return 
							}
							else {
								uni.chooseImage({
								count: 3,
								sizeType: ['original', 'compressed'],
								sourceType: ['album'],
								success: function(res) {
									res.tempFilePaths.forEach((item,index)=>{
										_self.imageList.push(item)
									})
									
								},
								fail: () => {
									uni.showToast({
										icon: 'none',
										title: '上传失败'
									})
								}
							})
							}
							
						},
            compressImg(e){
              console.log(e)  
            },
            changeIndicatorDots(e){
            this.isYasuo = !this.isYasuo
            },
           previewImage: function(e) {
           	var current = e.target.dataset.src
           	uni.previewImage({
           		current: current,
           		urls: this.imageList
           	})
           },
        },
		onNavigationBarButtonTap() {
			{
						 let _self = this
						// 点击发布的时候  如果没有登录 跳登录 
					 if(!uni.getStorageSync("currentUser")){
						 uni.navigateTo({
						 	url: '../my/login/login'
						 })
					 }
					 else {
						 if(this.page !== ''){
					        const _id	= uni.getStorageSync("id")
							var willUpdate = {}
							willUpdate._id = _id
							willUpdate.page = this.page
							willUpdate.willImgList = []
							willUpdate.willVideoList = []
							if(this.imageList.length>0){
								let willImgList = []
								this.imageList.forEach((item,i)=>{
											pathToBase64(item).then((base64) => {
												willUpdate.willImgList.push(base64)
												if(willUpdate.willImgList.length ===this.imageList.length ){
													uni.getStorage({
														key: "currentUser",
														success: (res => {
															// 拿着 token  去 请求 current  拿到 id 
															// 先发起一个请求 jwtd: JSON.parse(res.data).Token
															_self.request({
																url: interfaces.update,
																method: "POST",
																header: {
																	Authorization: JSON.parse(res.data).Token
																},
																data : {
																	 willUpdate : JSON.stringify(willUpdate)
																},
																success: (result) => {
																	uni.switchTab({
																		url: "./public-main"
																	})
																	
																}
															})
													
														})
													})
												}
											})
								})
							}						    
							// 发起请求 
							else {
								uni.getStorage({
									key: "currentUser",
									success: (res => {
										// 拿着 token  去 请求 current  拿到 id 
										// 先发起一个请求 jwtd: JSON.parse(res.data).Token
										console.log(JSON.parse(res.data).Token)
										_self.request({
											url: interfaces.update,
											method: "POST",
											header: {
												Authorization: JSON.parse(res.data).Token
											},
											data : {
											 willUpdate : JSON.stringify(willUpdate)
											},
											success: (result) => {
												if(result._id){
													uni.switchTab({
														url: './public-main'
													})
												}
											}
										})
								
									}),
									fail: () => {
										uni.showToast({
											icon: "none",
											title: "请登录"
										})
										setTimeout(()=>{
											uni.navigateTo({
												url:'../login/login'
											})
										},2000)
									}
								})
							}
						}
						else {
							uni.showToast({
								icon: "none",
								title: "输入内容不能为空"
							})
						}
					 }
						
					}
		}
    }
</script>

<style>
	@import "../../../common/uni.css";
    page {
        background-color: #EFEFF4;
    }

    .input-view {
        font-size: 28upx;
    }
    .close-view{
        text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
    }
</style>
