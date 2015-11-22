<script>
	function signIn() {
		$('#signButton').enable(false);
		$('#sign').hide();
		$('#signing').show();
		$('#signed').hide();
		
		$.ajax({
  			url: "/daily_signin",
  			success: function(response){
				var days = parseInt($('#condays').data('count'));
				$('#condays').html(days + 1);
				$('#sign').hide();
				$('#signing').hide();
				$('#signed').show();
				
				$('#points').html(response);
			},
			error: function(response){
				$('#signed').hide();
				$('#signing').hide();
				$('#sign').show();
			}
		});
	}

</script>

<div class="profile-widget">
	<div class="pw-header">
		<div class="pw-avatar">
			<!-- IF picture -->
			<img src="{picture}" class="pw-main" alt="" />
			<!-- ELSE -->
			<div class="user-icon" style="background-color: {icon:bgColor};">{icon:text}</div>
			<!-- ENDIF picture -->
		</div>
		<div class="pw-username">
			<span><i component="user/status" class="fa fa-circle status {status}" title="[[global:{status}]]"></i> <span class="account-username"> {username}</span></span>
		</div>
		<div class="pw-username">
			<button onclick="javascript:signIn()" class="btn btn-primary waves-effect" <!-- IF !canSignIn --> disabled="disabled" <!-- ENDIF !canSignIn -->id="signButton">
				<i class="fa fa-pencil" id="sign" <!-- IF !canSignIn --> style="display:none" <!-- ENDIF !canSignIn -->> 每日签到 </i>
				<i class="fa fa-calendar-check-o" <!-- IF canSignIn --> style="display:none" <!-- ENDIF canSignIn --> id="signed"> 连续签到 <span id="condays" data-count="{continDays}">{continDays}</span> 天 </i>
				<i class="fa fa-rocket" style="display:none" id="signing"> 签到中... </i>
			</button>
		</div>
	</div>
	<div class="row pw-details">
		<ul class="pw-follow">
			<li>
				<!-- IF !points -->
				<span style="display:block;" title="0" id="points">0</span>
				<!-- ELSE -->
				<span style="display:block;" title="{points}" id="points">{points}</span>
				<!-- ENDIF !points -->
				<span>积分</span>
			</li>
			<li>
				<span style="display:block;">{reputation}</span>
				<span>[[global:reputation]]</span>
			</li>
			<li>
				<span style="display:block;">{postcount}</span>
				<span>[[global:posts]]</span>
			</li>
			<li>
				<span class="human-readable-number account-bio-value" title="{followerCount}" style="display:block;">{followerCount}</span>
				<span class="account-bio-label">[[user:followers]]</span>
			</li>
			<li>
				<span class="human-readable-number account-bio-value" title="{followingCount}" style="display:block;">{followingCount}</span>
				<span class="account-bio-label">[[user:following]]</span>
			</li>
		</ul>
	</div>
</div>