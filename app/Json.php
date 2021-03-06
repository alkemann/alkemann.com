<?php

namespace app;

use alkemann\h2l\Message;
use alkemann\h2l\Response;
use alkemann\h2l\util\Http;

/**
 * Class Json
 *
 * @package alkemann\h2l
 */
class Json extends Response
{
    /**
     * @param mixed $content JSON encodable payload
     * @param int $code HTTP code to respond with, defaults to `200`
     * @param array $config inject config/overrides like `header_func`
     */
    public function __construct($content = null, int $code = Http::CODE_OK, array $config = [])
    {
        $this->config = $config;
        $this->message = (new Message())
            ->withCode($code)
            ->withHeaders([
                'Content-Type' => Http::CONTENT_JSON
            ])
            ->withBody($this->encodeAndContainData($content))
        ;
    }

    /**
     * Set header and return a string rendered and ready to be echo'ed as response
     *
     * Header 'Content-type:' will be set using `header` or an injeced 'header_func' through constructor
     */
    public function render(): string
    {
        $this->setHeaders();
        return $this->message->body();
    }

    private function encodeAndContainData($content): string
    {
        if (empty($content)) {
            return "";
        }
        if ($content instanceof \Generator) {
            $content = iterator_to_array($content);
        }
        return json_encode($content);
    }
}
