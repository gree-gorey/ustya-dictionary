# from flask import Flask, url_for
# from werkzeug.serving import run_simple
# from werkzeug.wsgi import DispatcherMiddleware
#
# app = Flask(__name__)
# app.config['APPLICATION_ROOT'] = '/abc/123'
#
# @app.route('/')
# def index():
#     return 'The URL for this page is {}'.format(url_for('index'))
#
# def simple(env, resp):
#     resp(b'200 OK', [(b'Content-Type', b'text/plain')])
#     return [b'Hello WSGI World']
#
# app.wsgi_app = DispatcherMiddleware(simple, {'/abc/123': app.wsgi_app})
#
# if __name__ == '__main__':
#     app.run('localhost', 5000)




print [1, 2, 3][-2::]


def beep():
    import os
    os.system('( speaker-test -t sine -f 1000 )& pid=$! ; sleep 0.3s ; kill -9 $pid')
