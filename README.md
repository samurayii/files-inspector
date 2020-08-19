## File inspector

## Описание.

Проверяет файлы по регулярным выражениям.

установка: `npm install -g file-inspector`

обновление: `npm update -g file-inspector`

## Конфигурация.

### Пример конфигурационного файла config.toml:
```toml
[logger]                # настройка логгера
    mode = "prod"       # режим (prod или dev или debug)
    enable = true       # активация логгера
    timestamp = true    # выводить время лога (true или false)
    type = true         # выводить тип лога (true или false)

[cron]                              # настройки крона
    interval = "1 1 * * * *"        # интервал очистки
    time_zone = "Europe/Moscow"     # часовой пояс

[inspector]                         # настройка инспектора
    folders = [                     # папка для сканирования
        "logs"
    ]              
    regexp = [                      # список регулярных выражений
        "bad_text\\.(js|json)$"
    ]

[[notifications]]
    enable = false                          # активация выхода
    name = "email"                          # имя выхода
    output_type = "email"                   # тип выхода
    host = "smtp.localhost"                 # адрес сервера
    port = 465                              # порт сервера
    from = "file_inspector@localhost.com"   # почта отправителя
    to = ""                                 # адресаты
    #cc = ""                                # адресаты для копии (НЕ ОБЯЗАТЕЛЬНО)
    #bcc = ""                               # адресаты для скрытой копии (НЕ ОБЯЗАТЕЛЬНО)
    subject = "file inspector"              # тема письма
    secure = false                          # использовать TLS
    ignore_tls = false                      # игнорировать TLS сервера
    attempts = 2                            # количество попыток
    attempt_interval = 10                   # интервал повтора попытки при неудачи
    [notifications.auth]                                                # авторизация для прокси сервера (НЕ ОБЯЗАТЕЛЬНО)
        type = "login"                                                  # тип авторизации (login или oauth2)
        username = "mikeymike"                                          # пользователь прокси
        password = "rapunz3l"                                           # пароль к прокси
        client_id = "000000000000-xxx0.apps.googleusercontent.com"      # идентификатор клиента, только oauth2 (НЕ ОБЯЗАТЕЛЬНО)
        client_secret = "XxxxxXXxX0xxxxxxxx0XXxX0"                      # секрет, только oauth2 (НЕ ОБЯЗАТЕЛЬНО)
        refresh_token = "1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx"       # токен обновление, только oauth2 (НЕ ОБЯЗАТЕЛЬНО)
        access_token = "ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x"           # токен доступа, только oauth2 (НЕ ОБЯЗАТЕЛЬНО)
        expires = 1484314697598                                         # время устаревания токена, только oauth2 (НЕ ОБЯЗАТЕЛЬНО)
        access_url = "xxxxxx"                                           # путь доступа
        service_client = "113600000000000000000"                        # идентификатор клиента сервиса
        private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBg..."  # сертификат
```

### Пример минимального конфигурационного файла config.toml:
```toml
[inspector]                         # настройка инспектора
    folders = [                     # папка для сканирования
        "logs"
    ]              
    regexp = [                      # список регулярных выражений
        "bad_text\\.(js|json)$"
    ]

[[notifications]]
    enable = true                       # активация выхода
    name = "email"                      # имя выхода
    output_type = "email"               # тип выхода
    host = "smtp.localhost"             # адрес сервера
    to = ""                             # адресаты
```