select *
from somorderitem soi
where soi.producttype = 'Promoção'
and soi.catalogid like 'Single Play Fibra TV'
and soi.action = 'adicionar'
--and soi.cwordercreationdate >= sysdate - 1440
and soi.cworderid not in (select aux.cworderid
                          from somorderitem aux
                          where aux.producttype = 'Promoção'
                          and aux.action = 'remover'
--                          and aux.cwordercreationdate >= sysdate - 1440
)
/*and soi.cworderid in (select aux.cworderid
                      from somorderitem aux
                      where aux.producttype = 'Bloqueio'
                      and aux.action = 'adicionar'
                      and aux.catalogid in  (--'BLOQ_BL', ** Bloqueio
                                            --'BLOQ_ORIGINADAS', ** Bloqueio
                                            'BLOQ_ORIGINADAS_CEL',-- ** Restrição
                                            'BLOQ_ORIGINADAS_DDD',-- ** Restrição
                                            'BLOQ_ORIGINADAS_DDI',-- ** Restrição
                                            'BLOQ_ORIGINADAS_0300',-- ** Restrição
                                            'BLOQ_ORIGINADAS_0500',-- ** Restrição
                                            'BLOQ_ORIGINADAS_0900',-- ** Restrição
                                            'BLOQ_RECEBIDAS',-- ** Restrição
                                            'BLOQ_RECEBIDAS_ACOBRAR',-- ** Restrição
                                            --'BLOQ_TV', ** Bloqueio
                                            --'BLOQVOIP_ORIG', ** Bloqueio
                                            'BLOQVOIP_ORIG_DDI',-- ** Restrição
                                            'BLOQVOIP_ORIG_LD',-- ** Restrição
                                            'BLOQVOIP_ORIG_VC1',-- ** Restrição
                                            'BLOQVOIP_ORIG_0300',-- ** Restrição
                                            'BLOQVOIP_ORIG_0500',-- ** Restrição
                                            'BLOQVOIP_ORIG_0900',-- ** Restrição
                                            --'BLOQVOIP_RECEB',
                                            'BLOQVOIP_RECEB_COBRAR'-- ** Restrição
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