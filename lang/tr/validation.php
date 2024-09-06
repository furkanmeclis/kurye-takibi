<?php

return [
    'accepted' => ':attribute kabul edilmelidir.',
    'accepted_if' => ':other :value olduğunda :attribute kabul edilmelidir.',
    'active_url' => ':attribute geçerli bir URL değil.',
    'after' => ':attribute :date tarihinden sonraki bir tarih olmalıdır.',
    'after_or_equal' => ':attribute :date tarihine eşit veya sonraki bir tarih olmalıdır.',
    'alpha' => ':attribute yalnızca harflerden oluşabilir.',
    'alpha_dash' => ':attribute yalnızca harfler, sayılar, tire ve alt çizgi içerebilir.',
    'alpha_num' => ':attribute yalnızca harfler ve sayılardan oluşabilir.',
    'array' => ':attribute bir dizi olmalıdır.',
    'before' => ':attribute :date tarihinden önceki bir tarih olmalıdır.',
    'before_or_equal' => ':attribute :date tarihine eşit veya önceki bir tarih olmalıdır.',
    'between' => [
        'numeric' => ':attribute :min ile :max arasında olmalıdır.',
        'file' => ':attribute :min ile :max kilobayt arasında olmalıdır.',
        'string' => ':attribute :min ile :max karakter arasında olmalıdır.',
        'array' => ':attribute :min ile :max arasında öğeye sahip olmalıdır.',
    ],
    'boolean' => ':attribute alanı doğru veya yanlış olmalıdır.',
    'confirmed' => ':attribute onayı eşleşmiyor.',
    'current_password' => 'Parola hatalı.',
    'date' => ':attribute geçerli bir tarih değil.',
    'date_equals' => ':attribute :date tarihine eşit bir tarih olmalıdır.',
    'date_format' => ':attribute :format formatıyla eşleşmiyor.',
    'declined' => ':attribute reddedilmelidir.',
    'declined_if' => ':other :value olduğunda :attribute reddedilmelidir.',
    'different' => ':attribute ve :other farklı olmalıdır.',
    'digits' => ':attribute :digits basamaklı olmalıdır.',
    'digits_between' => ':attribute :min ile :max basamak arasında olmalıdır.',
    'dimensions' => ':attribute geçersiz resim boyutlarına sahip.',
    'distinct' => ':attribute alanında yinelenen bir değer var.',
    'doesnt_end_with' => ':attribute şunlardan biriyle bitmeyebilir: :values.',
    'doesnt_start_with' => ':attribute şunlardan biriyle başlayamaz: :values.',
    'email' => ':attribute geçerli bir e-posta adresi olmalıdır.',
    'ends_with' => ':attribute şunlardan biriyle bitmelidir: :values.',
    'enum' => 'Seçilen :attribute geçersiz.',
    'exists' => 'Seçilen :attribute geçersiz.',
    'file' => ':attribute bir dosya olmalıdır.',
    'filled' => ':attribute alanı bir değere sahip olmalıdır.',
    'gt' => [
        'numeric' => ':attribute :value sayısından büyük olmalıdır.',
        'file' => ':attribute :value kilobayttan büyük olmalıdır.',
        'string' => ':attribute :value karakterden fazla olmalıdır.',
        'array' => ':attribute :value öğeden fazla olmalıdır.',
    ],
    'gte' => [
        'numeric' => ':attribute :value sayısından büyük veya eşit olmalıdır.',
        'file' => ':attribute :value kilobayttan büyük veya eşit olmalıdır.',
        'string' => ':attribute :value karakterden fazla veya eşit olmalıdır.',
        'array' => ':attribute :value veya daha fazla öğeye sahip olmalıdır.',
    ],
    'image' => ':attribute bir resim olmalıdır.',
    'in' => 'Seçilen :attribute geçersiz.',
    'in_array' => ':attribute :other içinde mevcut değil.',
    'integer' => ':attribute bir tamsayı olmalıdır.',
    'ip' => ':attribute geçerli bir IP adresi olmalıdır.',
    'ipv4' => ':attribute geçerli bir IPv4 adresi olmalıdır.',
    'ipv6' => ':attribute geçerli bir IPv6 adresi olmalıdır.',
    'json' => ':attribute geçerli bir JSON dizesi olmalıdır.',
    'lt' => [
        'numeric' => ':attribute :value sayısından küçük olmalıdır.',
        'file' => ':attribute :value kilobayttan küçük olmalıdır.',
        'string' => ':attribute :value karakterden az olmalıdır.',
        'array' => ':attribute :value öğeden az olmalıdır.',
    ],
    'lte' => [
        'numeric' => ':attribute :value sayısından küçük veya eşit olmalıdır.',
        'file' => ':attribute :value kilobayttan küçük veya eşit olmalıdır.',
        'string' => ':attribute :value karakterden az veya eşit olmalıdır.',
        'array' => ':attribute :value veya daha az öğeye sahip olmalıdır.',
    ],
    'mac_address' => ':attribute geçerli bir MAC adresi olmalıdır.',
    'max' => [
        'numeric' => ':attribute :max sayısından büyük olamaz.',
        'file' => ':attribute :max kilobayttan büyük olamaz.',
        'string' => ':attribute :max karakterden uzun olamaz.',
        'array' => ':attribute :max öğeden fazlasına sahip olamaz.',
    ],
    'mimes' => ':attribute :values türünde bir dosya olmalıdır.',
    'mimetypes' => ':attribute :values türünde bir dosya olmalıdır.',
    'min' => [
        'numeric' => ':attribute en az :min olmalıdır.',
        'file' => ':attribute en az :min kilobayt olmalıdır.',
        'string' => ':attribute en az :min karakter olmalıdır.',
        'array' => ':attribute en az :min öğeye sahip olmalıdır.',
    ],
    'multiple_of' => ':attribute :value\'nin katı olmalıdır.',
    'not_in' => 'Seçilen :attribute geçersiz.',
    'not_regex' => ':attribute formatı geçersiz.',
    'numeric' => ':attribute bir sayı olmalıdır.',
    'password' => [
        'letters' => ':attribute en az bir harf içermelidir.',
        'mixed' => ':attribute en az bir büyük harf ve bir küçük harf içermelidir.',
        'numbers' => ':attribute en az bir rakam içermelidir.',
        'symbols' => ':attribute en az bir sembol içermelidir.',
        'uncompromised' => 'Verilen :attribute bir veri ihlalinde ortaya çıktı. Lütfen farklı bir :attribute seçin.',
    ],
    'present' => ':attribute alanı mevcut olmalıdır.',
    'prohibited' => ':attribute alanı yasaklanmıştır.',
    'prohibited_if' => ':other :value olduğunda :attribute alanı yasaklanmıştır.',
    'prohibited_unless' => ':other :values içinde olmadığı sürece :attribute alanı yasaklanmıştır.',
    'prohibits' => ':attribute alanı :other\'ın mevcut olmasını yasaklar.',
    'regex' => ':attribute formatı geçersiz.',
    'required' => ':attribute alanı gereklidir.',
    'required_array_keys' => ':attribute alanı şunlar için girdiler içermelidir: :values.',
    'required_if' => ':other :value olduğunda :attribute alanı gereklidir.',
    'required_unless' => ':other :values içinde olmadığı sürece :attribute alanı gereklidir.',
    'required_with' => ':values mevcut olduğunda :attribute alanı gereklidir.',
    'required_with_all' => ':values mevcut olduğunda :attribute alanı gereklidir.',
    'required_without' => ':values mevcut olmadığında :attribute alanı gereklidir.',
    'required_without_all' => ':values\'dan hiçbiri mevcut olmadığında :attribute alanı gereklidir.',
    'same' => ':attribute ve :other eşleşmelidir.',
    'size' => [
        'numeric' => ':attribute :size olmalıdır.',
        'file' => ':attribute :size kilobayt olmalıdır.',
        'string' => ':attribute :size karakter olmalıdır.',
        'array' => ':attribute :size öğe içermelidir.',
    ],
    'starts_with' => ':attribute şunlardan biriyle başlamalıdır: :values.',
    'string' => ':attribute bir dize olmalıdır.',
    'timezone' => ':attribute geçerli bir saat dilimi olmalıdır.',
    'unique' => ':attribute zaten alınmış.',
    'uploaded' => ':attribute yüklenirken başarısız oldu.',
    'url' => ':attribute geçerli bir URL olmalıdır.',
    'uuid' => ':attribute geçerli bir UUID olmalıdır.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Burada :attribute için özel doğrulama mesajları belirtebilirsiniz.
    | Örneğin: 'invalid_email' => 'E-posta adresi geçersiz.',
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'özel-mesaj',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | Bu satırlar :attribute yer tutucusunun "E-Posta Adresi" gibi daha dostça
    | ifadelerle değiştirilmesine olanak tanır. Bu, mesajları daha temiz yapar.
    |
    */

    'attributes' => [],
];
