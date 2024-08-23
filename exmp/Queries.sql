select *
from somorderitem soi
where soi.producttype = 'Promo��o'
and soi.catalogid like 'Single Play Fibra TV'
and soi.action = 'adicionar'
--and soi.cwordercreationdate >= sysdate - 1440
and soi.cworderid not in (select aux.cworderid
                          from somorderitem aux
                          where aux.producttype = 'Promo��o'
                          and aux.action = 'remover'
--                          and aux.cwordercreationdate >= sysdate - 1440
)
/*and soi.cworderid in (select aux.cworderid
                      from somorderitem aux
                      where aux.producttype = 'Bloqueio'
                      and aux.action = 'adicionar'
                      and aux.catalogid in  (--'BLOQ_BL', ** Bloqueio
                                            --'BLOQ_ORIGINADAS', ** Bloqueio
                                            'BLOQ_ORIGINADAS_CEL',-- ** Restri��o
                                            'BLOQ_ORIGINADAS_DDD',-- ** Restri��o
                                            'BLOQ_ORIGINADAS_DDI',-- ** Restri��o
                                            'BLOQ_ORIGINADAS_0300',-- ** Restri��o
                                            'BLOQ_ORIGINADAS_0500',-- ** Restri��o
                                            'BLOQ_ORIGINADAS_0900',-- ** Restri��o
                                            'BLOQ_RECEBIDAS',-- ** Restri��o
                                            'BLOQ_RECEBIDAS_ACOBRAR',-- ** Restri��o
                                            --'BLOQ_TV', ** Bloqueio
                                            --'BLOQVOIP_ORIG', ** Bloqueio
                                            'BLOQVOIP_ORIG_DDI',-- ** Restri��o
                                            'BLOQVOIP_ORIG_LD',-- ** Restri��o
                                            'BLOQVOIP_ORIG_VC1',-- ** Restri��o
                                            'BLOQVOIP_ORIG_0300',-- ** Restri��o
                                            'BLOQVOIP_ORIG_0500',-- ** Restri��o
                                            'BLOQVOIP_ORIG_0900',-- ** Restri��o
                                            --'BLOQVOIP_RECEB',
                                            'BLOQVOIP_RECEB_COBRAR'-- ** Restri��o
                                            ))*/
;

select distinct soi.catalogid
from somorderitem soi
where soi.producttype = 'Bloqueio'
--and soi.catalogid not in ('Single Play Fibra BL')
--and soi.catalogid like '%Single%'
and soi.action = 'adicionar'
--and soi.cwordercreationdate >= sysdate - 90
order by 1
;