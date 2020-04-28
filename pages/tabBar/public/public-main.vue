<template>
	<view id="moments">

		<view class="home-pic">
			<view class="home-pic-base">
				<view class="top-pic">
					<image class="header" :src="userImg||initImg" @tap="test"></image>
				</view>
				<view class="top-name">{{name}}</view>
			</view>
		</view>

		<view class="moments__post" v-for="(post,index) in posts" :key="index" :id="'post-'+index">
			<view class="post-left">
				<image class="post_header" :src="post.user.avatar"></image>
			</view>

			<view class="post_right">
				<text class="post-username">{{post.user.name}}</text>
				<view id="paragraph" class="paragraph">{{post.page}}</view>
				<!-- 相册 -->
				<view class="thumbnails">
					<view :class="post.img.length === 1?'my-gallery':'thumbnail'" v-for="(image, index_images) in post.img" :key="index_images">
						<image class="gallery_img" lazy-load mode="aspectFill" :src="image" :data-src="image" @tap="previewImage(post.img,index_images)"></image>
					</view>
				</view>
				<!-- 资料条 -->
				<view class="toolbar">
					<view class="timestamp">{{dealTime(post.date)}}</view>
					<view class="like" @tap="like(post._id)">
						<image :src="post.likes.length===0?'../../../static/index/islike.png':'../../../static/index/like.png'"></image>
					</view>
					<view class="comment" @tap="go_comment(post._id)">
						<image src="../../../static/index/comment.png"></image>
					</view>
				</view>
				<!-- 赞／评论区 -->
				<view class="post-footer" v-if="post.comment.length>0 || post.likes.length>0 ">
					<view class="footer_content">
						<image class="liked" src="../../../static/index/liked.png"></image>
						<text class="nickname" v-for="(user,index_like) in post.likes" :key="index_like">{{user.user_name}}</text>
					</view>
					<view class="footer_content" v-for="(comment,comment_index) in post.comment" :key="comment_index" >
						<text class="comment-nickname">{{comment.name}}: <text class="comment-content">{{comment.comment_msg}}</text></text>
					</view>
				</view>
			</view>
			<!-- 结束 post -->
		</view>

		<view class="my_footer" v-if="showInput">
			<view class="footer-center">
				<input class="input-text" type="text"  v-model="inputValue" :focus="focus"  placeholder="placeholder"></input>
			</view>
			<view class="footer-right">
				<view id='msg-type' class="send-comment" @tap="sendMessge">发送</view>
			</view>
		</view>
	<!-- 	<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view> -->
	</view>

</template>

<script>
	import postData from '../../../common/index/index.post.data.js'; //朋友圈数据
	import interfaces from '../../../utils/interfaces.js'
	export default {
		data() {
			return {
				posts: [], //模拟数据
				user_id: 4,
				index: '',
				comment_index: '',

				input_placeholder: '评论', //占位内容
				focus: false, //是否自动聚焦输入框
				is_reply: false, //回复还是评论
				showInput: false, //评论输入框
                inputValue:"",
				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '', //可用窗口高度(不计入软键盘)

				loadMoreText: "加载中...",
				showLoadMore: false,
				name : "",
				initImg :"",
				userImg : "",
				
			}
		},
		onLoad() {
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					this.screenHeight = res.screenHeight;
					this.platform = res.platform;
				}
			});
			uni.startPullDownRefresh();
		},
		onShow() {
			uni.onWindowResize((res) => { //监听窗口尺寸变化,窗口尺寸不包括底部导航栏
				if (this.platform === 'ios') {
					this.windowHeight = res.size.windowHeight;
					this.adjust();
				} else {
					if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
						this.windowHeight = res.size.windowHeight;
						this.adjust();
					}
				}
			});
			this.request({
				url: interfaces.update,
				method: 'GET',
				success: res => {
					this.posts = res
				}
			});
			let currentTime = Date.now() / 1000
			
			uni.getStorage({
				key: "currentUser",
				success: (res_token => {
					// 拿着 token  去 请求 current  拿到 id 
					// 先发起一个请求 
					this.request({
						url: interfaces.user_isover,
						method: "POST",
						data: {
							current: currentTime,
							jwtd: JSON.parse(res_token.data).Token
						},
						success: (result) => {
							if (result.callbackMsg) {
								this.request({
									url: interfaces.user_current,
									method: "GET",
									header: {
										'Authorization': JSON.parse(res_token.data).Token
									},
									success: (res) => {
										this.id = res.id
										this.name = res.name
										this.userImg = res.avatar
										this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"

									}
								})
			
							} else {
								this.name = "点击登录"
								this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
								uni.clearStorageSync();
								uni.navigateTo({
									url: '../login/login'
								})
								console.log(1)
							}
						},
						fail: () => {
							this.name = "点击登录"
							this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
							uni.clearStorageSync();
							uni.navigateTo({
								url: '../login/login'
							})
						}
					})
			
				}),
				fail: () => {
					this.name = "点击登录"
					this.initImg = "https://avatar.bbs.miui.com/images/noavatar_small.gif"
					uni.clearStorageSync();
					uni.navigateTo({
						url: '../login/login'
					})
				}
			})
			
		},
		onHide() {
			uni.offWindowResize(); //取消监听窗口尺寸变化
		},
		computed: {

		},
		methods: {
			sendMessge(){
				uni.request({
					url: interfaces.undate_comment,
					method: 'POST',
					data: {
						page : this.inputValue,
						comment_id : this.comment_index,
						user_id : this.id,
						name : this.name
					},
					success: res => {
						this.request({
							url: interfaces.update,
							method: 'GET',
							success: result => {
								this.posts = result
								this.showInput = false
								this.inputValue = ""
							}
						});
					}
				});
			},
			go_comment(index){
				this.comment_index = index
				this.showInput = !this.showInput
			},
			dealTime(time) {
				const T = time.indexOf('T')
				time = time.substr(0, T)
				return time
			},
			test() {
				this.navigateTo('../test/test');
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			like(index) {
				// 一点赞 先改变样式  请求
				uni.getStorage({
					key : "currentUser",
					success : (res_token=>{
						this.request({
							url: interfaces.update_like,
							method: 'POST',
							header:{
								'Authorization': JSON.parse(res_token.data).Token
							},
							data: {
								msg_id : index,
								user_name : this.name
							},
							success: res => {
								if(res.errorStatus){
									uni.showToast({
									 title:"该用户以赞过",
									 icon:"none"
									})
								}
								else{
									this.request({
										url: interfaces.update,
										method: 'GET',
										success: res => {
											this.posts = res
										}
									});
								}
							},
						});
					})
				})
			},
			comment(index) {
				this.showInput = true; //调起input框
				this.focus = true;
				this.index = index;
			},
			adjust() { //当弹出软键盘发生评论动作时,调整页面位置pageScrollTo
				return;
				uni.createSelectorQuery().selectViewport().scrollOffset(res => {
					var scrollTop = res.scrollTop;
					let view = uni.createSelectorQuery().select("#post-" + this.index);
					view.boundingClientRect(data => {
						console.log("data:" + JSON.stringify(data));
						console.log("手机屏幕高度:" + this.screenHeight);
						console.log("竖直滚动位置" + scrollTop);
						console.log("节点离页面顶部的距离为" + data.top);
						console.log("节点高度为" + data.height);
						console.log("窗口高度为" + this.windowHeight);

						uni.pageScrollTo({
							scrollTop: scrollTop - (this.windowHeight - (data.height + data.top + 45)), //一顿乱算
							// scrollTop: 50, 
							duration: 300
						});
					}).exec();
				}).exec();
			},
			blur: function() {
				this.init_input();
			},
			init_input() {
				this.showInput = false;
				this.focus = false;
				this.input_placeholder = '评论';
				this.is_reply = false;
			},
			previewImage(imageList, image_index) {
				var current = imageList[image_index];
				uni.previewImage({
					current: current,
					urls: imageList
				});
			},
			goPublish() {
				uni.navigateTo({
					url: '',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "./public-publish"
			})
		}
	}
</script>

<style>
	@import url("../../../common/index/index.css");
	.my_footer {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 80upx;
		min-height: 80upx;
		border-top: solid 1px #bbb;
		overflow: hidden;
		padding: 5upx;
		background-color: #F4F5F6;
		position: fixed;
		bottom: 100upx;
	}
	.footer-left {
	
		width: 80upx;
		height: 80upx;
	
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.footer-right {
		width: 120upx;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #1482D1;
	}
	.footer-center {
		flex: 1;
		padding-left: 20upx;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.footer-center .input-text {
		flex: 1;
		background: #fff;
		/* border: solid 1upx #ddd; */
		padding: 10upx !important;
		font-family: verdana !important;
		overflow: hidden;
		border-radius: 15upx;
	}
	.nickname{
		margin-right: 12upx;
		}
	.footer-right .send-comment{
		background-color: #007AFF;
		text-align: center;
		line-height: 60upx;
		color: #FFFFFF;
		width: 80upx;
		height: 60upx;
		border-radius: 5px;
		font-size: 10px;
		/* height: 60upx; */
	}
</style>
