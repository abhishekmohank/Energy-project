import requests

auth_url = 'https://lb.solinteg-cloud.com/openapi/v2/loginv2/auth'
auth_account = 'shailendra.nair@atriapower.com'
auth_password = 'SolarEnergy'

base_data_url = 'https://lb.solinteg-cloud.com/openapi/v2/device/queryDeviceRealtimeData'

def get_auth_token(auth_url, auth_account, auth_password):
    payload = {
        'authAccount': auth_account,
        'authPassword': auth_password
    }
    response = requests.post(auth_url, json=payload)
    response.raise_for_status()
    auth_data = response.json()
    return auth_data['body']

def get_data(base_data_url, token, device_sn):
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/json',
        'token': token
    }
    params = {'deviceSn': device_sn}
    response = requests.get(base_data_url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()

def main():
    try:
        token = get_auth_token(auth_url, auth_account, auth_password)
        data = get_data(base_data_url, token, 'A102300100402049')
        if data and 'body' in data:
            return data['body']
        else:
            return {'error': 'Failed to decode data.'}
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}
    except KeyError as e:
        return {'error': str(e)}
    except ValueError as e:
        return {'error': str(e)}

if __name__ == '__main__':
    result = main()
    print(result)
