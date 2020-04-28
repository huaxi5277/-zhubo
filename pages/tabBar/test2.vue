<template>
	<view class="">

	</view>
</template>

<script>
	import io from '../../js_sdk/hyoga-uni-socket_io/uni-socket.io.js'
	export default {
		onShow() {

			var socket = io('http://localhost:4001', {
				query: {},
				transports: ['websocket', 'polling'],
				timeout: 5000,
			})
			socket.on('connect', () => {
				console.log('ws 已连接')
			});
			socket.emit('users', {
				id: 2
			})	
			var info = {
					send_id: 2,
					recover_id: 1,
					msg: "gouzi"
				}
				socket.emit('sendMsg', info)
			socket.on('receiveMsg', (data) => {
				console.log(data)
			})			
		}

	



	}
</script>

<style>
</style>
