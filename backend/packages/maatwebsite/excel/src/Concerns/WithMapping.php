<?php

namespace Maatwebsite\Excel\Concerns;

interface WithMapping
{
    /**
     * Map a single row for the export.
     *
     * @param mixed $row
     * @return array<int, string|int|float|null>
     */
    public function map($row): array;
}
