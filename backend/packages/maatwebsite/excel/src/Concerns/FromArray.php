<?php

namespace Maatwebsite\Excel\Concerns;

interface FromArray
{
    /**
     * Provide data rows to be exported.
     *
     * @return array<int, array<int, string|int|float|null>>
     */
    public function array(): array;
}
