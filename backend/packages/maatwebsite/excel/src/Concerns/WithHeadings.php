<?php

namespace Maatwebsite\Excel\Concerns;

interface WithHeadings
{
    /**
     * Provide heading rows for the export.
     *
     * @return array<int, string>
     */
    public function headings(): array;
}
