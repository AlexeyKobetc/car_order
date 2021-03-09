"# car_order"
<h4>Установка.</h4>
<p>Сохранить архив.</p>


 <h4>Инструкция.</h4>
<p>Ввести адрес отправления можно двумя способами.</p>
<p>
<strong>Первый</strong>. Ввод адреса в поле ввода. После того, как поле ввода потеряет фокус,
будет отправлен запрос на сервер Яндекса. Если введенный адрес будет найден в базе, он вернется в
развернутом виде (Страна + область + населенный пункт + улица + строение) и будет вставлен в поле
ввода вместо введенного пользователем. Если адрес будет не найден, поле пометится как не валидное.
</p>
<p>
<strong>Адрес признается валидным, если ввести его без уточнения номера дома</strong>.
Одновременно, c получением положительного ответа от сервера Яндекса, будут определенны координаты
адреса и маркер текущего местоположения пользователя будет установлен по этим координатам. Если
будет введен адрес без уточнения номера дома, указатель будет установлен на центр улицы.
</p>
<p>
<strong>Второй способ задания адреса отправления</strong>, перемещение маркера текущего положения
по карте. Одновременно, будет определятся координаты и адрес, куда будет передвинут маркер и
полученный адрес вставлятся в поле ввода.
</p>
<p>
Адрес назначения задается аналогично. С одним изменением. На начальном этапе загрузки карты
указатель места назначения отсутсвует. Для установки его на карте, нужно или ввести адрес в поле
ввода и он должен пройти валидацию. Или, указателем мыши или пальцем на экране, кликнуть по
нужному месту на карте.
</p>
<p>
<strong>Оба указателя на карте можно передвигать</strong>. При этом, после окончания движения
будет определятся адрес. И вставлятся в соответствующие поля ввода.
</p>
<p>
Таким образом. Определяющим фактором в каком регионе будет происходить поиск введенного адреса
является местонахождение маркера на карте.
</p>
<p>
Пример. Если маркер отправления и маркер назначения находятся в городе Екатеринбург. То, ввод в
оба поля адреса: "Ленина", установит адреса отправления и назначения, а также, маркеры, по
координатам улицы Ленина города Екатеринбурга.
</p>
<p>
Если один маркер назначения передвинуть в город Тюмень. То поиск улицы Ленина, в соответствующем
поле, будет происходить в городе Тюмень. А в поле отправления, в городе Екатеринбург.
</p>
<p>
Адрес можно вводить как на русском языке, так и латинице и в перевернутом виде, по-русски, забыв
переключить расскладку клавиатуры.
</p>
<p>
При запуске приложения на карте устанавливаются маркеры доступных автомобилей по случайным
смещениям координат относительно начально положения пользователя. Для каждой машины определяются
адреса, координаты и растояние до пользователя по дорогам. Самый ближний автомобиль всталяется в
заказ автоматически. При клике по карточке автомобилей, выбранный автомобиль вставляется в заказ.
</p>
<p>TODO. Сделать выбор автомобиля по клику маркера на карте.</p>
<p>
Автоматическое определение местоположения пользователя отключенно. Задано местоположение по
умолчанию: <strong>Россия, Свердловская область, Екатеринбург</strong>. Адреса, введенные, как
адрес отправления и адрес назначения, других населенных пунктов не будут проходить валидацию.
</p>
<p>
На данный момент программно установленно ограничение на определение местоположения пользователя
приложения населенным пунктом: <strong>Россия, Свердловская область, Екатеринбург</strong>.
</p>
