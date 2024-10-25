<!DOCTYPE html>
<html lang="tr">
<head>
    @php($fileUrl = url("front")."/")
    <meta charset="utf-8"/>
    <title>414 Express - Zamanında, Güvenle, Her Yerde</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="414 Express" name="author"/>
    <!-- favicon -->
    <link rel="shortcut icon" href="{{$fileUrl}}images/favicon.ico">

    <!-- Pixeden Icon -->
    <link rel="stylesheet" type="text/css" href="{{$fileUrl}}css/pe-icon-7.css"/>

    <!--Slider-->
    <link rel="stylesheet" href="{{$fileUrl}}css/owl.carousel.min.css"/>
    <link rel="stylesheet" href="{{$fileUrl}}css/owl.theme.default.min.css"/>

    <!-- css -->
    <link href="{{$fileUrl}}css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <link href="{{$fileUrl}}css/materialdesignicons.min.css" rel="stylesheet" type="text/css"/>
    <link href="{{$fileUrl}}css/style.min.css" rel="stylesheet" type="text/css"/>

</head>

<body>

<!-- Loader -->
<div id="preloader">
    <div id="status">
        <div class="sk-chase">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
        </div>
    </div>
</div>

<!--Navbar Start-->
<nav class="navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark nav-light">
    <div class="container">
        <!-- LOGO -->
        <a class="navbar-brand logo" href="layout-two-1.html">
            <img src="{{$fileUrl}}images/414-color.png" alt="" class="logo-dark" height="60">
            <img src="{{$fileUrl}}images/414-color.png" alt="" class="logo-light" height="60">
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <i class="mdi mdi-menu"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav ms-auto navbar-center" id="mySidenav">
                <li class="nav-item active">
                    <a href="#home" class="nav-link">Anasayfa</a>
                </li>

                <li class="nav-item">
                    <a href="#about" class="nav-link">Hakkımızda</a>
                </li>
                <li class="nav-item">
                    <a href="#features" class="nav-link">Özellikler</a>
                </li>
                <li class="nav-item">
                    <a href="#pricing" class="nav-link">Fiyatlandırma</a>
                </li>
                <li class="nav-item">
                    <a href="#contact" class="nav-link">İletişim</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
<!-- Navbar End -->

<!-- Hero Start -->
<style>
    @media only screen and (max-width: 600px) {
        .hero-7-bg-overlay {
            display: none;
        }
    }
</style>
<section class="hero-7-bg position-relative bg-gradient-primary" id="home">
    <div class="hero-7-bg-overlay"></div>
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-5">
                <div class="hero-title">
                    <div class="mb-4">
                        <i class="mdi mdi-google-circles-extended mdi-spin text-dark h1"></i>
                    </div>
                    <h1 class="hero-6-title">
                            <span class="text-wrapper">
                                <span class="letters text-dark fw-normal">Zamanında, Güvenle, Her Yerde</span>
                            </span>
                    </h1>
                    <p class="text-dark-70 mb-4 pb-2">İşletmenizin operasyonel süreçlerinde zamanında, güvenle, her
                        yerde 414 Express yanında!</p>
                    <a href="" class="btn btn-light">İletişime Geç <span class="ms-2 right-icon">&#8594;</span></a>
                </div>
            </div>

            <div class="col-lg-6 offset-lg-1">
                <div class="mt-5 mt-lg-0">
                    <img src="{{$fileUrl}}images/hero-7-img.png" alt="" class="img-fluid mx-auto d-block">
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="hero-bottom-img px-0">
                <img src="{{$fileUrl}}images/hero-7-shape-light.png" alt="" class="img-fluid shape-light mx-auto">
                <img src="{{$fileUrl}}images/hero-7-shape-dark.png" alt="" class="img-fluid shape-dark mx-auto">
            </div>
        </div>
    </div>
</section>
<!-- Hero End -->

<!-- Service Start -->
<section class="section" id="services">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-8">
                <div class="text-center mb-5">
                    <h4 class="text-uppercase mb-0">Hizmetlerimiz</h4>
                    <div class="my-3">
                    </div>
                    <p class="text-muted f-14"></p>
                </div>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col-lg-5">
                <div class="service-img me-lg-5 mb-5 mb-lg-0">
                    <img src="{{$fileUrl}}images/service-img.png" alt="" class="mx-auto d-block" height="600">
                </div>
            </div>
            <div class="col-lg-7">
                <div class="row">
                    <div class="col-md-6">
                        <div class="service-box service-box-1 p-4">
                            <div class="service-icon icon-primary mb-4 mt-3">
                                <i class="mdi mdi-package"></i>
                            </div>
                            <h4 class="mb-3 service-title">Standart Teslimat Hizmeti</h4>
                        </div>
                        <div class="service-box service-box-1 p-4">
                            <div class="service-icon icon-danger mb-4 mt-3">
                                <i class="mdi mdi-package"></i>
                            </div>
                            <h4 class="mb-3 service-title">Hızlı Teslimat Hizmeti</h4>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="service-box service-box-1 p-4 mt-md-5">
                            <div class="service-icon icon-success mb-4 mt-3">
                                <i class="mdi mdi-package"></i>
                            </div>
                            <h4 class="mb-3 service-title">Özel Paket ve Güvenli Teslimat Hizmeti</h4>
                        </div>
                        <div class="service-box service-box-1 p-4">
                            <div class="service-icon icon-info mb-4 mt-3">
                                <i class="mdi mdi-package"></i>
                            </div>
                            <h4 class="mb-3 service-title">Gece ve 7/24 Teslimat Hizmeti</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Service End -->

<!-- About us Start -->
<section class="section bg-light" id="about">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-8">
                <div class="text-center mb-5">
                    <h4 class="text-uppercase mb-0">Hakkımızda</h4>
                    <div class="my-3">
                    </div>
                </div>
            </div>
        </div>

        <div class="row align-items-center">
            <div class="col-lg-6">
                <div class="about-icon">
                    <i class="pe-7s-diamond display-4 text-primary mb-4"></i>
                </div>
                <h1 class="title fw-normal line-height-1_4 mb-4">Zamanında, Güvenle, Her Yerde</h1>
                <div class="about-border my-4"></div>
                <p class="text-muted mb-4 f-15">Restoranların paket servis ihtiyacını güvenle ve hızla karşılamak
                    için kurulduk. Firmamız, yemek teslimatında üstün kaliteyi hedefleyerek, restoranlar ve
                    müşteriler arasındaki en önemli köprülerden biri olmayı amaçlamaktadır. Misyonumuz, zamanında,
                    güvenilir ve hızlı teslimat hizmeti sunarak, müşteri memnuniyetini her zaman en üst seviyede
                    tutmaktır. Ekibimiz, her teslimatı büyük bir özenle gerçekleştirir ve hizmet verdiğimiz her
                    yerde aynı standartları koruruz. Müşterilerimizin ihtiyaçlarına odaklanarak, onlara güvenilir
                    bir çözüm ortağı olmayı taahhüt ediyoruz.</p>
            </div>

            <div class="col-lg-5 offset-lg-1 mt-5 mt-lg-0">
                <div class="service-img me-lg-5 mb-5 mb-lg-0">
                    <img src="{{$fileUrl}}images/slide.jpg" alt="" class="mx-auto d-block" height="500">
                </div>
            </div>
        </div>
</section>
<!-- About us End -->

<!-- Fetures Start -->
<section class="section" id="features">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-8">
                <div class="text-center mb-5">
                    <h4 class="text-uppercase mb-0">Özelliklerimiz</h4>
                    <div class="my-3">
                    </div>
                    <p class="text-muted f-14">414 Express'in sahip olduğu eşsiz özellikleri inceleyin.</p>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-6">
                <div class="feature-box text-center px-4 py-5">
                    <div class="text-primary feature-icon mb-3">
                        <i class="pe-7s-world"></i>
                    </div>
                    <h6 class="text-uppercase mb-1 title f-18">Unique Elements</h6>
                    <p class="mb-0 text-muted">Itaque earum rerum tenetur.</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="feature-box text-center px-4 py-5">
                    <div class="text-primary feature-icon mb-3">
                        <i class="pe-7s-headphones"></i>
                    </div>
                    <h6 class="text-uppercase mb-1 title f-18">Active Community</h6>
                    <p class="text-muted mb-0">Itaque earum rerum tenetur</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="feature-box text-center px-4 py-5">
                    <div class="text-primary feature-icon mb-3">
                        <i class="pe-7s-cup"></i>
                    </div>
                    <h6 class="text-uppercase mb-1 title f-18">High Performance</h6>
                    <p class="text-muted mb-0">Itaque earum rerum tenetur</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="feature-box text-center px-4 py-5">
                    <div class="text-primary feature-icon mb-3">
                        <i class="pe-7s-cash"></i>
                    </div>
                    <h6 class="text-uppercase mb-1 title f-18">Premium Plugins</h6>
                    <p class="text-muted mb-0">Itaque earum rerum tenetur</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="feature-box text-center px-4 py-5">
                    <div class="text-primary feature-icon mb-3">
                        <i class="pe-7s-shield"></i>
                    </div>
                    <h6 class="text-uppercase mb-1 title f-18">Privacy Policy</h6>
                    <p class="text-muted mb-0">Itaque earum rerum tenetur</p>
                </div>
            </div>
            <div class="col-lg-4 col-md-6">
                <div class="feature-box text-center px-4 py-5">
                    <div class="text-primary feature-icon mb-3">
                        <i class="pe-7s-airplay"></i>
                    </div>
                    <h6 class="text-uppercase mb-1 title f-18">Responsive Layout</h6>
                    <p class="text-muted mb-0">Itaque earum rerum tenetur</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="text-center mt-5">
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Fetures End -->

<!-- Counter Start -->
<Section class="section counter-bg">
    <div class="counter-bg-overlay"></div>
    <div class="container">
        <div class="row align-items-center" id="counter">
            <div class="col-lg-3 col-md-6">
                <div class="mb-4 mb-lg-0">
                    <h2 class="text-white mb-4">Sayılarla <br>414 Express</h2>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="counter-box-1 text-center px-4 py-5 mb-4 mb-lg-0">
                    <div class="text-white">
                        <img src="{{$fileUrl}}images/icon/icon-1.png" alt="" class="img-fluid mx-auto d-blok">
                        <h1 class="mb-2 mt-3"><span class="counter-value mt-4" data-count="620">0</span>+</h1>
                        <p class="mb-0 text-white-70">Aktif İş Ortağı</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="counter-box-1 text-center px-4 py-5 mb-4 mb-lg-0">
                    <div class="text-white">
                        <img src="{{$fileUrl}}images/icon/icon-2.png" alt="" class="img-fluid mx-auto d-blok">
                        <h1 class="mb-2 mt-3"><span class="counter-value mt-4" data-count="1200">0</span></h1>
                        <p class="mb-0 text-white-70">Mutlu Müşteri</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="counter-box-1 text-center px-4 py-5 mb-4 mb-lg-0">
                    <div class="text-white">
                        <img src="{{$fileUrl}}images/icon/icon-3.png" alt="" class="img-fluid mx-auto d-blok">
                        <h1 class="mb-2 mt-3"><span class="counter-value mt-4" data-count="450">0</span></h1>
                        <p class="mb-0 text-white-70">Ödül</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</Section>
<!-- Counter End -->

<!-- Pricing Start -->
<!--
<section class="section" id="pricing">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-8">
                <div class="text-center mb-5">
                    <h4 class="text-uppercase mb-0">Select Your Plan</h4>
                    <div class="my-3">
                        <img src="images/title-border.png" alt="" class="img-fluid mx-auto d-block">
                    </div>
                    <p class="text-muted f-14">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4">
                <div class="pricing-box rounded text-center position-relative px-4 py-5 mb-4">
                    <img src="images/pricing/img-1.png" alt="" class="img-fluid mx-auto d-block">
                    <h3 class="pricing-title title text-uppercase mt-5 mb-4">Basic</h3>
                    <div class="text-muted py-3">
                        <p class="">Bandwidth: <b class="highlight">1GB</b></p>
                        <p class="">Support: <b class="highlight">No</b></p>
                        <p class=""><b>No</b> Hidden Fees</p>
                    </div>
                    <p class="text-muted f-15 mb-4">All Extension Included <span class="d-block f-18"><b>$12.90/Year</b></span></p>
                    <a href="" class="btn btn-outline-primary">Buy Now <span class="ms-2 right-icon">&#8594;</span></a>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="pricing-box rounded text-center position-relative active px-4 py-5 mb-4">
                    <div class="ribbon">
                        <p class="mb-0 text-white f-13">-25%</p>
                    </div>
                    <img src="images/pricing/img-2.png" alt="" class="img-fluid mx-auto d-block">
                    <h3 class="pricing-title title text-uppercase mt-5 mb-4">Standard</h3>
                    <div class="text-muted py-3">
                        <p class="">Bandwidth: <b class="highlight">1.5GB</b></p>
                        <p class="">Support: <b class="highlight">Yes</b></p>
                        <p class=""><b>No</b> Hidden Fees</p>
                    </div>
                    <p class="text-muted f-15 mb-4">All Extension Included <span class="d-block f-18"><b>$49.99/Year</b></span></p>
                    <a href="" class="btn btn-primary">Buy Now <span class="ms-2 right-icon">&#8594;</span></a>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="pricing-box rounded text-center position-relative px-4 py-5 mb-4">
                    <img src="images/pricing/img-3.png" alt="" class="img-fluid mx-auto d-block">
                    <h3 class="pricing-title title text-uppercase mt-5 mb-4">Premium</h3>
                    <div class="text-muted py-3">
                        <p class="">Bandwidth: <b class="highlight">2GB</b></p>
                        <p class="">Support: <b class="highlight">No</b></p>
                        <p class=""><b>No</b> Hidden Fees</p>
                    </div>
                    <p class="text-muted f-15 mb-4">All Extension Included <span class="d-block f-18"><b>$89.99/Year</b></span></p>
                    <a href="" class="btn btn-outline-primary">Buy Now <span class="ms-2 right-icon">&#8594;</span></a>
                </div>
            </div>
        </div>
    </div>
</section>
-->
<!-- Pricing End -->


<!-- contact Us Start -->
<section class="section" id="contact">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-8">
                <div class="text-center mb-5">
                    <h4 class="text-uppercase mb-0">Bize Ulaşın</h4>
                    <div class="my-3">
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-4">
                <div class="contact-address">
                    <h4 class="title mb-4">İletişim Bilgileri</h4>
                    <p class="text-muted f-15">Restoranlar ve müşteriler için kusursuz bir deneyim sunarak,
                        geleceğin teslimat standartlarını belirleyen öncü bir firma olmayı hedefliyoruz. </p>
                    <p class="text-muted f-15 mb-4">Müşteri memnuniyetini her adımda daha yükseğe taşıyan,
                        sürdürülebilir, dinamik ve her zaman bir adım önde bir şirket olarak sektörde kalıcı bir iz
                        bırakmak en büyük vizyonumuzdur.</p>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="contact-address">
                            <h5 class="title f-18">Adres</h5>
                            <p class="text-muted f-15">Karşıyaka Mah. Recep Tayyip Erdoğan Blv. Bozbey Sitesi Altı A
                                Blok 45/AB İç Kapı No:3 Karaköprü/ŞANLURFA</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-7 offset-lg-1">
                <div class="custom-form mt-4 mt-lg-0">
                    <div id="message"></div>
                    <form method="post" action="{{route("sendContactMail")}}" name="contact-form" id="contact-form">
                        @csrf
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group app-label mb-3">
                                    <label for="name" class="mb-2">İsim</label>
                                    <input name="name" id="name" type="text" class="form-control"
                                           placeholder="İsminiz...">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group app-label mb-3">
                                    <label for="email" class="mb-2">Mail Adresiniz</label>
                                    <input name="email" id="email" type="email" class="form-control"
                                           placeholder="mail@414express.com.tr">
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="form-group app-label mb-3">
                                    <label for="subject" class="mb-2">Konu</label>
                                    <input type="text" class="form-control" id="subject" placeholder="Konu"/>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="form-group app-label mb-3">
                                    <label for="comments" class="mb-2">Mesajınız</label>
                                    <textarea name="message" id="comments" rows="3" class="form-control"
                                              placeholder="Mesajınız"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <button type="submit" id="submit" name="send" class="btn btn-primary">Gönder <i
                                        class="mdi mdi-telegram ms-2"></i></button>
                                <div id="simple-msg"></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- contact Us End -->

<!-- Footer Start -->
<section class="footer">
    <div class="container">
        <div class="row mb-4">
            <div class="col-lg-4 col-sm-6">
                <div class="mb-4">
                    <a href="layout-two-1"><img src="{{$fileUrl}}images/414-color.png" alt="" class="logo-light"
                                                width="150"
                                                height="50"/></a>
                    <a href="layout-two-1"><img src="{{$fileUrl}}images/414-color.png" alt="" class="logo-dark"
                                                height="50"/></a>
                </div>
                <p class="footer-desc f-15">Restoranlar ve müşteriler için kusursuz bir deneyim sunarak, geleceğin
                    teslimat standartlarını belirleyen öncü bir firma olmayı hedefliyoruz. </p>
                <ul class="footer-icons list-inline f-20 mb-0 mt-4">
                    <li class="list-inline-item me-3"><a href="#" class=""><i class="mdi mdi-facebook"></i></a></li>
                    <li class="list-inline-item me-3"><a href="#" class=""><i class="mdi mdi-twitter"></i></a></li>
                    <li class="list-inline-item me-3"><a href="#" class=""><i class="mdi mdi-instagram"></i></a>
                    </li>
                    <li class="list-inline-item"><a href="#" class=""><i class="mdi mdi-linkedin"></i></a></li>
                </ul>
            </div>
            <div class="col-lg-7 offset-lg-1">
                <div class="row mt-lg-0">
                    <div class="col-md-4 mt-4 mt-lg-0">
                        <h5 class="footer-list-title f-18 fw-normal mb-3" style="color:#222222;"><b>Kurumsal</b>
                        </h5>
                        <ul class="list-unstyled company-sub-menu">
                            <li><a href="">Hakkımızda</a></li>
                            <li><a href="">Hizmetlerimiz</a></li>
                            <li><a href="">İletişim</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4 mt-4 mt-lg-0">
                        <h5 class="footer-list-title f-18 fw-normal mb-3" style="color:#222222;"><b>Yasal</b></h5>
                        <ul class="list-unstyled company-sub-menu">
                            <li><a href="">Şartlar & Koşullar</a></li>
                            <li><a href="">Gizlilik Politikası</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 mt-3">
                <div class="text-center footer-alt my-3">
                    <p class="f-15">2024 © Copyright</p>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Footer End -->

<!-- javascript -->
<script src="{{$fileUrl}}js/jquery.min.js"></script>
<script src="{{$fileUrl}}js/bootstrap.bundle.min.js"></script>
<script src="{{$fileUrl}}js/scrollspy.min.js"></script>
<script src="{{$fileUrl}}js/jquery.easing.min.js"></script>
<!-- anime -->
<script src="{{$fileUrl}}js/anime.min.js"></script>
<script src="{{$fileUrl}}js/animate-text.init.js"></script>
<!-- COUNTER -->
<script src="{{$fileUrl}}js/counter.int.js"></script>
<!-- carousel -->
<script src="{{$fileUrl}}js/owl.carousel.min.js"></script>
<!-- Main Js -->
<script src="{{$fileUrl}}js/app.js"></script>

</body>

</html>
