<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
    require 'PHPMailer.php';
    require 'Exception.php';
    require 'SMTP.php';

    $filepath = $_FILES['file']['tmp_name'];
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader
//require 'vendor/autoload.php';

// Instantiation and passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
    // $mail->isSMTP();                                            // Send using SMTP
    // $mail->Host       = 'smtp1.example.com';                    // Set the SMTP server to send through
    // $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    // $mail->Username   = 'user@example.com';                     // SMTP username
    // $mail->Password   = 'secret';                               // SMTP password
    // $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    // $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    //Recipients
    $mail->setFrom('skastrat@mail.ru', 'Mailer');
   // $mail->addAddress('joe@example.net', 'Joe User');     // Add a recipient
    $mail->addAddress('skastrat@mail.ru');               // Name is optional
   // $mail->addReplyTo('info@example.com', 'Information');
   // $mail->addCC('cc@example.com');
   // $mail->addBCC('bcc@example.com');

    // Attachments
    if (isset($_FILES['file']) &&
    $_FILES['file']['error'] == UPLOAD_ERR_OK) {
    $mail->AddAttachment($_FILES['file']['tmp_name'],
                         $_FILES['file']['name']);
    }
   // $mail->addAttachment($filepath);         // Add attachments
   // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

    // Content
    $mail->CharSet = "utf-8";
    $name = $_POST['name'];

    $phone = $_POST['phone'];

    $service = $_POST['service'];

    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = "Запрос услуги $phone";
    $mail->Body    = "Имя: $name <br>\nТелефон: $phone <br>\nУслуга: $service";
    //$mail->Body    .= 'This is the HTML message body <b>in bold!</b>';
    //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'true';
  //else { echo 'Ошибка при загрузке файла'; }

} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

// // Получаем значения переменных из пришедших данных

// $name = $_POST['name'];

// $phone = $_POST['phone'];

// $service = $_POST['service'];

// $email = 'skastrat@mail.ru';

// $header = "Запрос услуги $phone";

// $file = $_FILES['file'];
// //$message = $_POST['message'];

 
// // Формируем сообщение для отправки, в нём мы соберём всё, что ввели в форме 

// $mes = "Имя: $name \nТелефон: $phone \nУслуга: $service";// \nТекст: $message";

 
// // Пытаемся отправить письмо по заданному адресу

// // Если нужно, чтобы письма всё время уходили на ваш адрес — замените первую переменную $email на свой адрес электронной почты

// $send = mail ($email,$header,$mes,"Content-type:text/plain; charset = UTF-8\r\n");//From:$email");

 
// // Если отправка прошла успешно — так и пишем 

// if ($send == 'true')

// //{echo "Сообщение отправлено";}
// {echo 'true'; echo $file;}
// // Если письмо не ушло — выводим сообщение об ошибке

// else {echo 'false';}

?>