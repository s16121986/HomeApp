<?php

namespace Module\Api\Controller;

use App\Models\Oauth\Client;
use Exception;
use Module\Api\Services\Oauth\Request;
use Illuminate\Routing\Controller;

class OauthController extends Controller {

	public function authorize(Request $request) {
		//authorize?response_type=code&client_id=[YOUR ID]&redirect_uri=[YOUR REDIRECT URI]&scope=[YOUR SCOPE]

		//var_dump($request->getQuery());exit;

		$redirectUri = $request->input('redirect_uri');
		if (!$redirectUri)
			throw new Exception('Redirect uri undefined');

		$state = $request->input('state');
		$token = self::findToken($request);
		$token->setState($state);
		$code = $token->generageCode();

		$params = ['code' => $code, 'state' => $state];

		return response()->redirect($redirectUri . '?' . http_build_query($params));
	}

	public function token(Request $request) {
		//token?client_id=[YOUR ID]&client_secret=[YOUR SECRET]&grant_type=authorization_code&scope=[YOUR SCOPE]&code=[YOUR CODE]&redirect_uri=[YOUR REDIRECT URI]

		//Db::insert('oauth_test', ['data' => json_encode($this->getRequest()->getPost())]);

		//$data = (array)json_decode('{"code":"1Hw6H9hvvChHGM7Gw2jv","client_secret":"aQnIxS3REUmJuZlZkbUl3czZCaGRSa3F0Mzo3RmpmcDB","grant_type":"authorization_code","client_id":"yandex-oauth-f7weca","redirect_uri":"https:\/\/social.yandex.net\/broker\/redirect"}');
		$token = self::findToken($request);
		$token->generageToken();

		return $token->getAuthData();
	}

	private static function findToken($request) {
		$clientId = $request->input('client_id');
		$client = Client::findByIdentifier($clientId);
		if ($client->client_secret !== $request->input('client_secret'))
			throw new Exception('client_secret failed');

		$token = $client->token();
		if ($token->code !== $request->input('code'))
			throw new Exception('auth code undefined');

		return $token;
	}

}
