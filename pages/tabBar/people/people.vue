<template>
	<view class="friend_list-wrap">
		<view class="friend_list-wrap-item" v-if="friend_list.length>0" v-for="(item,index) in friend_list" :key="index" @tap="go_chat(item.friend_id)">
			<view class="img-box">
				<image :src="item.avatar || initImg" mode=""></image>
			</view>
			<view class="content-box">
				<view class="item_name_top">
					{{item.name}}
				</view>
				<view class="item_name_bottom">
					{{item.email}}
				</view>
			</view>
		</view>
		<view class="no-friend" v-if="friend_list.length==0">
			暂无联系人
		</view>
	</view>
</template>

<script>
	import interfaces from '../../../utils/interfaces.js'
	export default {
		data(){
			return{
				friend_list : [],
				initImg : "https://avatar.bbs.miui.com/images/noavatar_small.gif",
			}
		},
		methods:{
			go_chat(index){
				// 跳转聊天页面
				uni.navigateTo({
					url:"../chat-main/chat-main?chat=" + index
				})
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "../my/add/add"
			})
		},
		onShow() {
			const id = uni.getStorageSync("id")
			if(id){
				this.request({
				url : interfaces.friend_current_all,
				method : "POST",
				data : {
					current_user_id : id
				},
				success : (res)=>{
					console.log(res)
					if(res.msg){
						return 
					}
					else {
						this.friend_list = res.friends
					}
				}
			})
			}
			
		}
	}
</script>

<style lang="scss">
	.friend_list-wrap{
		width: 92%;
		padding: 0 4%;
		box-sizing: border-box;
		.friend_list-wrap-item{
			width: 100%;
			padding: 40upx;
			display: flex;
			border-bottom: 1px solid #d5d5d6 ;
			.img-box{
				image{
					width: 100upx;
					height: 100upx;
					border-radius: 50%;
				}
			}
			.content-box{
				margin-left: 40upx;
				.item_name_top{
					color: #00dcff;
					font-size: 40upx;
				}
				.item_name_bottom{
					margin-top: 20upx;
					color: #999;
					font-size: 30upx;
				}
			}
			
		}
		.no-friend{
			margin-top: 40upx;
			width: 100%;
			text-align: center;
			color: #0A98D5;
			font-size: 22upx;
		}
		
	}
</style>
