location.hash||(location.hash=Math.floor(16777215*Math.random()).toString(16));const roomHash=location.hash.substring(1),drone=new ScaleDrone("2xmbUiTsqTzukyf7"),roomName="observable-"+roomHash,configuration={iceServers:[{urls:"stun:stun.l.google.com:19302"}]};let room,pc;function onSuccess(){}function onError(e){console.error(e)}function sendMessage(e){drone.publish({room:roomName,message:e})}function startWebRTC(e){(pc=new RTCPeerConnection(configuration)).onicecandidate=(e=>{e.candidate&&sendMessage({candidate:e.candidate})}),e&&(pc.onnegotiationneeded=(()=>{pc.createOffer().then(localDescCreated).catch(onError)})),pc.onaddstream=(e=>{remoteVideo.srcObject=e.stream}),navigator.mediaDevices.getUserMedia({audio:!0,video:!0}).then(e=>{localVideo.srcObject=e,pc.addStream(e)},onError),room.on("data",(e,o)=>{o.id!==drone.clientId&&(e.sdp?pc.setRemoteDescription(new RTCSessionDescription(e.sdp),()=>{"offer"===pc.remoteDescription.type&&pc.createAnswer().then(localDescCreated).catch(onError)},onError):e.candidate&&pc.addIceCandidate(new RTCIceCandidate(e.candidate),onSuccess,onError))})}function localDescCreated(e){pc.setLocalDescription(e,()=>sendMessage({sdp:pc.localDescription}),onError)}drone.on("open",e=>{if(e)return console.error(e);(room=drone.subscribe(roomName)).on("open",e=>{e&&onError(e)}),room.on("members",e=>{console.log("MEMBERS",e),startWebRTC(2===e.length)})});